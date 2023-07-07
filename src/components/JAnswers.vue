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

            //存session跟axios的requestBody
            //參加者資料
            answerSurveyId: null,
            answerDate: null,
            answerName: '',
            answerPhone: '',
            answerEmail: '',
            answerAge: 0,
            answerOption: [],  //存答案資料
            requiredQuestions: [], //存必填題目資料
            changedData: null,
            selectedOptionValue: {}, // 存儲每個問題的選項值

            //環境變數API
            findOneSurveyAPI: import.meta.env.VITE_FIND_ONE_SURVEY,
            findOneSurveyAPI: import.meta.env.VITE_FIND_ONE_SURVEY,
            //用網址抓id
            surveyId: null,
        }
    },
    methods: {
        clear() {
            this.answerOption = [];
            this.answerName = '';
            this.answerPhone = '';
            this.answerEmail = '';
            this.answerAge = 0;
        },
        checkEmpty() {

            console.log(this.answerName, this.answerPhone, this.answerEmail, this.answerAge)
            //資訊欄
            if (this.answerName === "" || this.answerPhone === "" || this.answerEmail === "" || this.answerAge <= 0) {
                this.$swal({
                    icon: 'error',
                    title: '錯誤!',
                    text: '填寫者資訊欄有空白或年紀錯誤!'
                });
            }

            if (this.answerOption.length <= 0) {
                this.$swal({
                    icon: 'error',
                    title: '錯誤!',
                    text: '不可提交空白答案!'
                });
            }

            //篩選必填題目
            this.requiredQuestions = this.questionList.filter((question) => question.required);

            if (this.requiredQuestions.length === 0) {
                console.log("沒有必填，直接送出")

            } else {
                for (let i = 0; i < this.requiredQuestions.length; i++) {
                    const requiredId = this.requiredQuestions[i].questionId;

                    for (let j = 0; j < this.answerOption.length; j++) {
                        const answerOptionId = this.answerOption[j].questionId;

                        //相同id時，檢查答案是否為空
                        if (requiredId.toString() === answerOptionId) {
                            if (this.answerOption[j].selectedOptionValue.length <= 0 || this.answerOption[j].selectedOptionValue == null || this.answerOption[j].selectedOptionValue == "") {
                                this.$swal({
                                    icon: 'error',
                                    title: '錯誤!',
                                    text: '',
                                    html: `尚有必填欄位尚未填寫唷:
                                ${this.requiredQuestions[i].question}`
                                });
                            }
                        } else {
                            console.log("都填寫完囉")
                        }
                    }
                }
            }


        },
        handleOptionChange(event, questionId) {
            const question = this.questionList.find(question => question.questionId === questionId);

            if (question.questionType === '單選') {
                const selectedOptionValue = event.target.value;

                // 將答案存儲到對應的問答題答案對象中
                this.selectedOptionValue[questionId] = selectedOptionValue;

                // console.log(this.selectedOptionValue);
            } else if (question.questionType === '多選') {
                const selectedOptionValue = event.target.value;

                // 確保 selectedOptionValue[questionId] 是一個陣列
                if (!Array.isArray(this.selectedOptionValue[questionId])) {
                    this.selectedOptionValue[questionId] = [];
                }

                // 檢查選項是否已經存在於陣列中
                const index = this.selectedOptionValue[questionId].indexOf(selectedOptionValue);

                if (index > -1) {
                    // 如果選項已存在，則從陣列中移除
                    this.selectedOptionValue[questionId].splice(index, 1);
                } else {
                    // 如果選項不存在，則添加到陣列中
                    this.selectedOptionValue[questionId].push(selectedOptionValue);
                }

                // console.log(this.selectedOptionValue);
            } else if (question.questionType === '簡答') {
                const selectedOptionValue = event.target.value;
                // console.log('event:', event);
                // console.log('Selected option:', selectedOptionValue);
                // console.log('Question ID:', questionId);

                // 將答案存儲到對應的問答題答案對象中
                this.selectedOptionValue[questionId] = [selectedOptionValue];
            }

            // 將物件轉換成陣列
            const answerArray = this.selectedOptionValue.map((selectedOptionValue, questionId) => {
                return {
                    questionId,
                    selectedOptionValue
                };
            });

            console.log(answerArray);
            this.answerOption = answerArray;
            console.log("轉換成answerArray.length:", this.answerOption.length);
        }

    },
    created() {
        //取網址上的surveyId+加到session裡
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
                    console.log(res.data);
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
        } else {
            // surveyid 不存在
            console.log("新增模式");
            this.surveyId = null;
        }
    },
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
        </div>
        <div class="answer_area">
            <h1>{{ title }}</h1>
            <h2>{{ description }}</h2>
            <div class="box" v-for="(questions, index) in questionList">

                <h3>
                    <div class="h3_div">
                        <!-- 類型 -->
                        <span class="show_type" v-if="questions.questionType === '多選'">
                            多選題
                        </span>
                        <span class="show_type" v-else-if="questions.questionType === '單選'">
                            單選題
                        </span>
                        <span class="show_type" v-else>
                            問答題
                        </span>
                        <i class="fa-regular fa-circle-question fa-lg" style="color: #39b500;">
                        </i>
                    </div>
                    <span class="question__a">
                        {{ questions.question }}
                    </span>
                    <!-- 是否必填 -->
                    <span class="show_required" v-if="questions.required === true">
                        𖤐必填
                    </span>
                </h3>


                <!-- 多選 -->
                <div v-if="questions.questionType === '多選'">
                    <div v-for="(option, optionIndex) in questions.options.split(';')" :key="optionIndex">
                        <input type="checkbox" :id="`option${questions.questionId}_${optionIndex}`" :value="option"
                            @input="handleOptionChange($event, questions.questionId, option)">
                        <label :for="`option${questions.questionId}_${optionIndex}`">
                            {{ option }}
                        </label>
                    </div>
                </div>

                <!-- 單選 -->
                <div v-else-if="questions.questionType === '單選'">
                    <select v-model="selectedOptionValue[questions.questionId]"
                        @change="handleOptionChange($event, questions.questionId, selectedOptionValue)">
                        <option v-for="(option, optionIndex) in questions.options.split(';')" :key="optionIndex"
                            :value="option">
                            {{ option }}
                        </option>
                    </select>
                </div>


                <!-- 問答 -->
                <div v-else>
                    <textarea cols="30" rows="5" placeholder="輸入答案"
                        @input="handleOptionChange($event, questions.questionId, $event.target.value, -1)"></textarea>
                </div>
            </div>
        </div>

        <div class="send_area">
            <button type="button" id="clear" @click="clear">清 空</button>
            <button type="button" id="sendToDB" @click="checkEmpty">完 成 送 出</button>
        </div>
        <h2 class="des_save">注意! 送出後不能修改!!!</h2>
    </div>
</template>
<style lang="scss">
.main {
    position: relative;

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
            padding: 10px;
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