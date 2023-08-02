<script>
import axios from 'axios';
import { RouterLink, RouterView } from 'vue-router';
export default {
    data() {
        return {
            //顯示題目
            title: '',
            description: '',
            questionList: [],
            isInvalid: [], //變更樣式用

            //存session跟axios的requestBody
            //參加者資料
            answerSurveyId: null,
            answerDate: null,
            answerName: '',
            answerPhone: '',
            answerEmail: '',
            answerAge: 0,
            answerOption: [],  //存答案資料
            changedData: null,
            mutipleSelectedValue: [], // 存儲多選問題的選項值
            selectedOptionValue: {}, // 存儲每個問題的選項值
            rememberMe: false,

            //環境變數API
            findOneSurveyAPI: import.meta.env.VITE_FIND_ONE_SURVEY,
            addAnswerAPI: import.meta.env.VITE_ADD_ANSWER,
            //用網址抓id
            surveyId: null,

            //提示
            showTypeSingle: '單選題 一次只能選擇一個檔案',
            showTypeMutiple: '多選題 可以依照符合條件全部勾選',
            showTypeText: '文字題 快發揮你的創意，字數不限!',
        }
    },
    created() {
        //取網址上的surveyId
        const survey_id = this.$route.params.surveyId;

        if (typeof survey_id !== 'undefined' && survey_id !== null) {
            const requestdata = {
                search_survey_id: survey_id,
            }
            axios({
                method: 'post',
                url: this.findOneSurveyAPI,
                data: requestdata,
            })
                .then((res) => {
                    // console.log(res.data);
                    this.answerSurveyId = res.data.survey.surveyId;
                    this.questionList = res.data.questionList
                    this.title = res.data.survey.title;
                    this.description = res.data.survey.description;
                    // 生成一個有N個長度的空元素的陣列
                    setTimeout(() => {
                        this.selectedOptionValue = Array(res.data.questionList.length).fill(null);
                        console.log("初期生成的selectedOptionValue空陣列長度:", this.selectedOptionValue.length);
                    }, 1000);
                }).catch((err) => {
                    console.log(err)
                });

            //取得sessionStorage的填寫人資料 ||'' <-提供預設值
            this.answerName = sessionStorage.getItem('answerName') || "";
            this.answerPhone = sessionStorage.getItem('answerPhone') || "";
            this.answerEmail = sessionStorage.getItem('answerEmail') || "";
            this.answerAge = sessionStorage.getItem('answerAge') || 0;
            if (sessionStorage.getItem('answerName')) {
                this.rememberMe = true;
            }

        } else {
            // surveyid 不存在
            console.log("新增模式");
        }
    },
    methods: {
        showPersonErrorAlert() {
            const Toast = this.$swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                // timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', this.$swal.stopTimer);
                    toast.addEventListener('mouseleave', this.$swal.resumeTimer);
                }
            });

            Toast.fire({
                icon: 'error',
                title: '錯誤',
                html: `填寫者資訊還有資料未填寫!`
            });
        },
        showRequiredErrorAlert() {
            const Toast = this.$swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                // timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', this.$swal.stopTimer);
                    toast.addEventListener('mouseleave', this.$swal.resumeTimer);
                }
            });

            Toast.fire({
                icon: 'error',
                title: '錯誤',
                html: `必填欄位尚未填寫唷:
                ${this.requiredQuestions[i].question}`
            });
        },
        //當每個選項有變更
        handleOptionChange(event, questionId, required, questionIndex) {


            const question = this.questionList.find(question => question.questionId === questionId);

            const selectedOptionValue = event.target.value;

            //假如必填卻沒填
            if (required == true && selectedOptionValue.trim() === ""
                || selectedOptionValue === "undefined"
                || selectedOptionValue === []
                || selectedOptionValue === null) {
                this.isInvalid[questionIndex] = true;
            } else {
                this.isInvalid[questionIndex] = false;
            }


            if (question.questionType === '單選') {
                // 將答案存儲到對應的問答題答案對象中
                this.selectedOptionValue[questionIndex] = selectedOptionValue
            }

            else if (question.questionType === '多選') {
                if (this.mutipleSelectedValue === [] || this.mutipleSelectedValue.indexOf(selectedOptionValue) < 0) {
                    this.mutipleSelectedValue.push(selectedOptionValue)
                }
                else {
                    this.mutipleSelectedValue.splice(this.mutipleSelectedValue.indexOf(selectedOptionValue), 1);
                    //splice(n,m) = 從第N個index開始,刪除M個元素
                }
                this.selectedOptionValue[questionIndex] = this.mutipleSelectedValue
            }

            else if (question.questionType === '簡答') {
                // console.dir(selectedOptionValue)
                this.selectedOptionValue[questionIndex] = selectedOptionValue
            }
        },
        //送出按鈕
        checkEmpty() {

            //設定填寫時間 --- 時區偏移量，以毫秒為單位
            const now = new Date();
            const timezoneOffset = now.getTimezoneOffset() * 60000;
            this.answerDate = new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 10);

            //先確認填寫者是否為空
            console.log(this.answerName, this.answerPhone, this.answerEmail, this.answerAge)
            if (this.answerName === "" || this.answerPhone === "" || this.answerEmail === "" || this.answerAge <= 0) {
                this.showPersonErrorAlert();
            }

            // 轉換分題的陣列，轉存string
            // "," 轉 ";"
            const selectOptStr = this.selectedOptionValue.join(';')
            // console.log("轉成字串:", selectOptStr)

            this.answerOption = this.selectedOptionValue
            const requestdata = {
                'add_response_answer': {
                    'answerDate': this.answerDate,
                    'answerName': this.answerName,
                    'answerPhone': this.answerPhone,
                    'answerEmail': this.answerEmail,
                    'answerAge': this.answerAge,
                    'answerSurveyId': this.answerSurveyId,
                    'answerOption': selectOptStr,
                }
            }

            console.log('終於要存進資料庫：', requestdata);

            axios({
                method: 'post',
                url: this.addAnswerAPI,
                data: requestdata,
            })
                .then((res) => {
                    console.dir(res.data);
                    if (res.data.questionList !== null || res.data.survey !== null) {
                        this.$swal({
                            icon: 'success',
                            title: '已送出回答!',
                            showComfirmButtom: true,
                            showCancelButton: true,
                            confirmButtonText: '查看統計',
                            cancelButtonText: '回到問卷清單',
                            confirmButtonColor: '#39b500',
                            cancelButtonColor: '#b80000',
                            reverseButtons: true,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // 查看統計
                                localStorage.clear();
                                setTimeout(() => {
                                    this.$router.push('/join/result/' + this.answerSurveyId);
                                }, 300); // 延遲 0.5 秒後跳頁

                            } else if (result.dismiss === this.$swal.DismissReason.cancel) {
                                // 回到問卷清單(回上一頁)
                                this.surveyId = null;
                                localStorage.clear();
                                setTimeout(() => {
                                    this.$router.push('survey_info');
                                }, 300); // 延遲 0.5 秒後跳頁
                            }
                        });

                    } else {
                        console.log('請求失敗:', res.data.message);
                        this.$swal({
                            icon: 'error',
                            title: '錯誤',
                            text: '資料有誤!請檢查是否有遺漏!',
                        });
                        return;
                    }

                }).catch((err) => {
                    console.log("錯誤", err)
                });
        },
    },
    watch: {
        rememberMe: {
            handler(newVal) {
                // 勾選記住我時
                if (newVal) {
                    sessionStorage.setItem('answerName', this.answerName)
                    sessionStorage.setItem('answerPhone', this.answerPhone)
                    sessionStorage.setItem('answerEmail', this.answerEmail)
                    sessionStorage.setItem('answerAge', this.answerAge)
                }
                // 取消勾選記住我時
                else {
                    sessionStorage.removeItem('answerName', this.answerName)
                    sessionStorage.removeItem('answerPhone', this.answerPhone)
                    sessionStorage.removeItem('answerEmail', this.answerEmail)
                    sessionStorage.removeItem('answerAge', this.answerAge)
                }
            }
        }
    }
}
</script>
<template>
    <div class="main">
        <div class="answerperson_area">
            <h1>填寫者</h1>
            <div class="box">
                <h2>姓名</h2>
                <input type="text" name="answerName" id="answerName" placeholder="王小明" v-model="answerName">
                <h2>手機</h2>
                <input type="text" name="answerPhone" id="answerPhone" placeholder="0900123456" v-model="answerPhone">
            </div>
            <div class="box">
                <h2>信箱</h2>
                <input type="text" name="answerEmail" id="answerEmail" placeholder="example@email.com"
                    v-model="answerEmail">
                <h2>年齡</h2>
                <input type="number" name="answerAge" id="answerAge" placeholder="25" v-model="answerAge">
            </div>

            <!-- 記住我 勾選區 -->
            <div class="rememberMe_box">
                <input type="checkbox" id="rememberMe" v-model="rememberMe">
                <label for="rememberMe">記住我 (關閉瀏覽器將自動清除)</label>
            </div>
        </div>
        <div class="answer_area">
            <h1>{{ title }}</h1>
            <h2 class="description_area">{{ description }}</h2>
            <div class="box" v-for="(questions, questionIndex) in questionList">

                <h3>
                    <div class="h3_div">
                        <!-- 類型 -->
                        <span class="show_type" v-if="questions.questionType === '多選'">
                            多選題
                            <i class="fa-regular fa-circle-question fa-lg" style="color: #39b500;" :title="showTypeMutiple">
                            </i>
                        </span>
                        <span class="show_type" v-else-if="questions.questionType === '單選'">
                            單選題
                            <i class="fa-regular fa-circle-question fa-lg" style="color: #39b500;" :title="showTypeSingle">
                            </i>
                        </span>
                        <span class="show_type" v-else>
                            問答題
                            <i class="fa-regular fa-circle-question fa-lg" style="color: #39b500;" :title="showTypeText">
                            </i>
                        </span>

                    </div>
                    <span class="question__a" :class="{ 'error-input': isInvalid[questionIndex] }">
                        {{ questions.question }}
                    </span>
                    <!-- 是否必填 -->
                    <span class="show_required" v-if="questions.required === true">
                        𖤐必填
                    </span>
                </h3>


                <!-- 多選 -->
                <div v-if="questions.questionType === '多選'">
                    <!-- v-for產生選項 -->
                    <div v-for="(option, optionIndex) in questions.options.split(';')" :key="optionIndex">
                        <input type="checkbox" :id="`option${questions.questionId}_${optionIndex}`" :value="option"
                            @change="handleOptionChange($event, questions.questionId, questions.required, questionIndex)">
                        <label :for="`option${questions.questionId}_${optionIndex}`">
                            {{ option }}
                        </label>
                    </div>
                </div>

                <!-- 單選 -->
                <div v-else-if="questions.questionType === '單選'">
                    <select :id="`option${questions.questionId}`"
                        @change="handleOptionChange($event, questions.questionId, questions.required, questionIndex)"
                        value="">
                        <option v-for="(option, optionIndex) in questions.options.split(';')" :key="optionIndex"
                            :value="option">
                            {{ option }}
                        </option>
                    </select>
                </div>


                <!-- 問答 -->
                <div v-else>
                    <textarea :id="`option${questions.questionId}`" cols="30" rows="5" placeholder="輸入答案"
                        @change="handleOptionChange($event, questions.questionId, questions.required, questionIndex)"></textarea>
                </div>
            </div>
        </div>

        <div class="send_area">
            <button type="button" id="sendToDB" @click="checkEmpty">完 成 送 出</button>
        </div>
        <h2 class="des_save">注意! 送出後不能修改!!!</h2>
    </div>
</template>
<style lang="scss">
.main {
    position: relative;

    .error-input {
        color: #eb0000;
    }

    //懸浮視窗
    .fa-circle-question {
        position: relative;
        display: inline-block;

        &::after {
            content: attr(title);
            visibility: hidden;
            background-color: #c9ffb0;
            color: #000000;
            padding: 5px;
            margin: 10px;
            border-radius: 4px;
            font-size: 16px;
            font-family: 'cjkFonts';
            opacity: 0;
            transition: visibility 3s, opacity 0.1s ease-in-out;
        }

        &:hover::after {
            visibility: visible;
            opacity: 1;
        }
    }


    hr {
        border: 2px dashed #39b500;
        margin: 30px 0;
    }

    .show_type {
        font-size: 20px;
        color: #39b500;
    }

    .show_required {
        font-size: 16px;
        color: #ff4242;
        position: absolute;
        right: 5%;
    }


    .answerperson_area {

        h1 {
            text-align: center;
            font-size: 24px;
            background-color: #c9ffb0;
            padding: 10px;
        }



        .box {
            display: flex;
            width: 90%;
            margin: 20px auto;

            h2 {
                font-size: 20px;
                margin: 7px;
            }

            input {
                width: 35%;
                font-size: 20px;
            }

            //必填未填時會顯示的框限
            .error-border {
                border: 1px solid #ff4242;
            }
        }

        .rememberMe_box {
            margin: 20px 40px;
            display: flex;
            align-items: center;

            input[type=checkbox] {
                height: 18px;
                width: 18px;
            }


        }

    }


    .answer_area {

        h1 {
            text-align: center;
            background-color: #c9ffb0;
            padding: 10px;
            font-size: 24px;
        }

        h2 {
            font-size: 18px;
            text-align: center;
            background-color: #c9ffb0;
            padding: 10px 15%;
        }


        select {
            width: 120px;
            font-size: 18px;
            padding: 10px 10px;
            margin: 10px;

        }

        .box {
            width: 90%;
            margin: auto;

            h3 {
                font-size: 20px;
                padding: 10px 50px 10px 0;
                border-bottom: 2px dashed #39b500;
                margin: 20px 0px 10px 0;

                .h3_div {
                    margin: 10px 0;
                }
            }

            input {
                font-size: 18px;
                padding: 10px 0;
                margin: 10px;
            }

            select {
                width: 50%;
                white-space: pre-wrap;
                word-break: break-all;
            }

            textarea {
                font-size: 16px;
                width: 90%;
            }
        }

    }

    .send_area {
        display: flex;
        justify-content: center;
        align-items: center;

        #clear {
            background-color: #c90000;
            border: #540000;
            height: 50px;
            width: 200px;
            color: white;
            font-size: 24px;
            border-radius: 10px;
            margin: 20px auto;

            &:hover {
                background-color: #eb0000;
                border: #540000;
            }

        }

        #sendToDB {
            background-color: #40c900;
            border: #1B5400;
            height: 50px;
            width: 200px;
            color: white;
            font-size: 24px;
            border-radius: 10px;
            margin: 20px auto;

            &:hover {
                background-color: #48e400;
                border: #1B5400;
            }

        }
    }

    .des_save {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        font-size: 24px;
        color: #b80000;
        font-weight: bolder;
        line-height: 30px;
        text-align: center;
        margin-bottom: 50px;
    }
}
</style>