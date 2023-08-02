<script>
import axios from 'axios';
export default {
    data() {
        return {
            //預設值
            //survey:
            surveyId: null,
            title: '',
            description: '',
            createDate: null,
            startDate: null,
            endDate: null,
            question_list: null,

            //環境變數API
            addSurveyAndQuestionAPI: import.meta.env.VITE_ADD_SURVEY_AND_QUESTION,
            updateSurveyAPI: import.meta.env.VITE_UPDATE_SURVEY,

        }
    },
    created() {
        //頁面一開始就從session抓出來:) (如果有資料的話)

        //取出Survey暫存
        const savedSurveyData = localStorage.getItem('saveSurvey');
        console.log(savedSurveyData);
        if (savedSurveyData) {
            const surveyData = JSON.parse(savedSurveyData);
            this.surveyId = surveyData.surveyId;
            this.title = surveyData.title;
            this.description = surveyData.description;
            this.startDate = surveyData.startDate;
            this.endDate = surveyData.endDate;
        }

        //取出Question暫存
        const savedQuestionData = localStorage.getItem('questionData');
        if (savedQuestionData) {
            const question_list = JSON.parse(savedQuestionData);
            // console.log(questionData)
            this.question_list = question_list;
        }

        //設定時區
        const now = new Date();
        const timezoneOffset = now.getTimezoneOffset() * 60000;

        const checkData = {
            createDate: new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 10),
        }
        this.createDate = checkData.createDate;
        //把資料傳回父層
        this.$emit('saveCheck', checkData);
    },
    methods: {
        //確認送出前是否有空白
        checkEmpty() {
            if (
                this.question_list === [] ||
                this.title === "" ||
                this.startDate === null ||
                this.endDate === null) {
                this.$swal({
                    icon: 'error',
                    title: '錯誤!',
                    text: '有項目空白，請檢查內容!',
                });
                return;
            }
            this.saveQuestion();
        },
        saveQuestion() {
            //新增問卷模式
            if (this.surveyId === null || this.surveyId === undefined) {
                const requestData = {
                    'survey': {
                        'title': this.title,
                        'description': this.description,
                        'createDate': this.createDate,
                        'startDate': this.startDate,
                        'endDate': this.endDate,
                    },
                    'questionList': this.question_list
                };
                console.log(requestData);

                //送到後端!
                axios({
                    method: 'post',
                    url: this.addSurveyAndQuestionAPI,
                    data: requestData,
                })
                    .then((res) => {
                        console.log(res);
                        if (res.data.questionList !== null || res.data.survey !== null) {
                            this.$swal({
                                icon: 'success',
                                title: '成功!',
                                showComfirmButtom: true,
                                showCancelButton: true,
                                confirmButtonText: '至投票頁面查看',
                                cancelButtonText: '新增另一個問卷',
                                confirmButtonColor: '#39b500',
                                cancelButtonColor: '#b80000',
                                reverseButtons: true,
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    this.surveyId = null;
                                    this.$emit('saveSurvey', null)
                                    this.$emit('saveQuestions', null)
                                    this.$emit('saveCheck', null)
                                    this.$router.push('survey_info');
                                    localStorage.clear();

                                    setTimeout(() => {
                                        this.$router.push('/join/surveylist');
                                    }, 500); // 延遲 0.5 秒後跳頁

                                } else if (result.dismiss === this.$swal.DismissReason.cancel) {
                                    // 新增下一個商品(刷新頁面)
                                    this.surveyId = null;
                                    this.$emit('saveSurvey', null)
                                    this.$emit('saveQuestions', null)
                                    this.$emit('saveCheck', null)
                                    localStorage.clear();
                                    setTimeout(() => {
                                        this.$router.push('survey_info');
                                    }, 500); // 延遲 0.5 秒後跳頁
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
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
            // 更新問卷模式 = surveyId有值的時候
            else {
                const requestData = {
                    'update_survey_id': this.surveyId,
                    'update_title': this.title,
                    'update_description': this.description,
                    'update_start_date': this.startDate,
                    'update_end_date': this.endDate,
                    'update_question_list': this.question_list,
                };
                console.log(requestData);

                axios({
                    method: 'post',
                    url: this.updateSurveyAPI,
                    data: requestData,
                })
                    .then((res) => {
                        console.log(res);
                        if (res.data.questionList !== null || res.data.survey !== null) {
                            this.$swal({
                                icon: 'success',
                                title: '更新成功!',
                                showComfirmButtom: true,
                                showCancelButton: true,
                                confirmButtonText: '至投票頁面查看',
                                cancelButtonText: '新增另一個問卷',
                                confirmButtonColor: '#39b500',
                                cancelButtonColor: '#b80000',
                                reverseButtons: true,
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    // 轉跳投票頁 (回到第一頁、清除session、讓surveyId歸零)
                                    this.$router.push('/join');
                                    this.surveyId = null;
                                    this.$emit('saveSurvey', null)
                                    this.$emit('saveQuestions', null)
                                    this.$emit('saveCheck', null)
                                    localStorage.clear();

                                } else {
                                    // 跳轉新增問卷第一頁
                                    this.clear();
                                    this.surveyId = null;
                                    this.$emit('saveSurvey', null)
                                    this.$emit('saveQuestions', null)
                                    this.$emit('saveCheck', null)
                                    this.$router.push('survey_info');
                                    localStorage.clear();
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
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }


        },
        //清空父層資料、session，回到第一頁
        clear() {
            this.$swal({
                icon: 'question',
                iconColor: '#39b500',
                title: '確定要清空嗎?',
                showComfirmButtom: true,
                showCancelButton: true,
                confirmButtonText: '確定',
                cancelButtonText: '取消',
                confirmButtonColor: '#39b500',
                cancelButtonColor: '#b80000',
                reverseButtons: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    // 回到第一頁
                    this.surveyId = null;
                    this.$emit('saveSurvey', null)
                    this.$emit('saveQuestions', null)
                    this.$emit('saveCheck', null)
                    localStorage.clear();
                    this.$router.push('survey_info');
                }
            })
        },
    },
}
</script>
<template>
    <div class="main">
        <p class="des">創建日期：{{ createDate }}</p>
        <hr>
        <h1>問卷資訊</h1>
        <div class="box">
            <h2>問卷標題</h2>
            <h3>{{ title }}</h3>
        </div>
        <div class="box">
            <h2>問卷描述</h2>
            <pre>{{ description }}</pre>
        </div>
        <div class="box">
            <h2>開始時間</h2>
            <h3>{{ startDate }}</h3>
        </div>
        <div class="box">
            <h2>結束時間</h2>
            <h3>{{ endDate }}</h3>
        </div>

        <RouterLink to="/create/survey_info" class="button">修改問卷資訊</RouterLink>

        <hr>
        <div class="show">
            <h1>題目與選項</h1>
            <table>
                <thead>
                    <tr>
                        <th class="num">序</th>
                        <th class="ques">題目</th>
                        <th class="typ">類型</th>
                        <th class="req">必填</th>
                        <th class="opt">選項</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="( item, index ) in  question_list " :key="index">
                        <td class="num">{{ index + 1 }}</td>
                        <td class="ques">{{ item.question }}</td>
                        <td class="typ">{{ item.questionType }}</td>
                        <td class="req" v-if="item.required === true">✓</td>
                        <td class="req" v-else></td>
                        <td class="opt">{{ item.options }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <RouterLink to="/create/questions" class="button">修改題目與答案</RouterLink>
        <hr>
        <p class="des_save">都確認正確了嗎？記得按下送出!</p>
        <div class="send_area">
            <button type="button" id="clear" @click="clear">全 部 清 空</button>
            <button type="button" id="sendToDB" @click="checkEmpty">完 成 送 出</button>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.main {
    position: relative;
    padding: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    a {
        background-color: #2b8900;
        padding: 10px 20px;
        height: 28px;
        color: white;
        border-radius: 10px;
        line-height: 30px;
        margin: auto;

        &:hover {
            background-color: #36aa00;
        }
    }

    hr {
        border: 2px dashed #39b500;
        margin: 30px 0;
    }

    h1 {
        font-size: 24px;
        font-weight: bolder;
        text-align: center;
    }

    .box {
        display: flex;

        h2 {
            width: 20%;
            margin: 22px 5px;
            padding: 5px 5px;
            font-size: 15px;
            font-weight: bold;
        }

        h3 {
            width: 80%;
            margin: 18px 5px;
            padding: 5px 5px;
            font-size: 20px;
            background-color: #c9ffb0;
            height: 20px;
        }

        pre {
            width: 85%;
            margin: 19px 5px;
            padding: 5px 5px;
            font-size: 20px;
            background-color: #c9ffb0;
            //自動換行
            white-space: pre-wrap;
            word-wrap: break-word;
        }
    }

    .show {
        table {
            border: 1px solid #1B5400;
            margin: 20px auto;

            thead,
            tbody {

                th {
                    padding: 5px 10px;
                    white-space: pre-wrap;
                    word-break: break-all;
                    background-color: #C1FFA4;
                }

                tr {
                    border: 1px solid #1B5400;
                    white-space: pre-wrap;
                    word-break: break-all;

                    .num,
                    .typ,
                    .req {
                        width: 5%;
                        border: 1px solid #1B5400;
                        padding: 5px 10px;
                        text-align: center;
                        white-space: pre-wrap;
                        word-break: break-all;
                    }

                    .opt,
                    .ques {
                        width: 20%;
                        border: 1px solid #1B5400;
                        padding: 5px 10px;
                        white-space: pre-wrap;
                        word-break: break-all;
                    }

                }

            }
        }
    }

    .des {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        color: #1B5400;
        font-weight: bolder;
        margin-top: 20px;
    }

    .des_save {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        font-size: 28px;
        color: #b80000;
        font-weight: bolder;
        line-height: 30px;
        text-align: center;
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

        #deleteSurvey {
            background-color: #c90000;
            border: #540000;
            height: 50px;
            width: 200px;
            color: white;
            font-size: 24px;
            font-weight: bolder;
            border-radius: 10px;
            margin: 20px auto;

            &:hover {
                background-color: #eb0000;
                border: #540000;
            }
        }

    }
}
</style>