
<script>
import { RouterLink, RouterView } from "vue-router";
import axios from 'axios';

// import { ref, watch } from 'vue';

import CSurvey from "../components/CSurvey.vue";
import CQuestions from "../components/CQuestions.vue";
import CCheck from "../components/CCheck.vue";

export default {
    components: {
        CSurvey,
        CQuestions,
        CCheck,
    },
    data() {
        return {
            title: "",
            description: "",
            startDate: null,
            endDate: null,
            createDate: null,
            question_list: null,

            //用網址抓id、session
            surveyId: null,
            surveyData: null,

            //環境變數
            findOneSurveyAPI: import.meta.env.VITE_FIND_ONE_SURVEY,

        }
    },
    methods: {
        getSurveyData(saveSurveyData) {
            if (saveSurveyData) {
                this.surveyId = saveSurveyData.surveyId;
                this.title = saveSurveyData.title;
                this.description = saveSurveyData.description;
                this.startDate = saveSurveyData.startDate;
                this.endDate = saveSurveyData.endDate;
            }
        },
        getQuestionsData(saveQuestionData) {
            if (saveQuestionData) {
                this.question_list = saveQuestionData;
            }
        },
        getCheckData(saveCheckData) {
            if (saveCheckData) {
                this.createDate = saveCheckData.createDate;
            }
        },
        consoleAll() {
            console.log("===問卷===");
            console.log("surveyId=" + this.surveyId);
            console.log("title=" + this.title);
            console.log("description=" + this.description);
            console.log("startDate=" + this.startDate);
            console.log("endDate=" + this.endDate);
            console.log("createDate=" + this.createDate);
            console.log("===問題===");
            console.log("question_list=");
            console.log(this.question_list);
        },
        getUrlSurveyId() {
            const survey_id = this.$route.params.surveyId;
            if (typeof survey_id !== 'undefined' && survey_id !== null) {
                const requestdata = {
                    'search_survey_id': survey_id,
                }
                axios({
                    method: 'post',
                    url: this.findOneSurveyAPI,
                    data: requestdata,
                })
                    .then((res) => {
                        console.log(res.data);
                        this.surveyId = res.data.survey.surveyId;
                        this.title = res.data.survey.title;
                        this.description = res.data.survey.description;
                        this.startDate = res.data.survey.startDate;
                        this.endDate = res.data.survey.endDate;
                        this.createDate = res.data.survey.createDate;
                        this.question_list = res.data.questionList;
                    }).then(() => {
                        this.surveyData = {
                            surveyId: this.surveyId,
                            title: this.title,
                            description: this.description,
                            startDate: this.startDate,
                            endDate: this.endDate,
                            createDate: this.endDate,
                        }
                        console.log(this.surveyData);
                        //存進session
                        localStorage.setItem('saveSurvey', JSON.stringify(this.surveyData));
                        localStorage.setItem('questionData', JSON.stringify(this.question_list));
                        setTimeout(() => {
                            // 延遲 1 秒後執行跳頁操作
                            this.$router.push('/create/survey_info');
                        }, 500); // 1000 毫秒 = 1 秒
                    })
            } else {
                // surveyid 不存在
                console.log("新增模式");
                this.surveyId = null;
                this.title = ""; // 設定為預設值
            }
        }
    },
    created() {
        //取網址上的surveyId+加到session裡
        this.getUrlSurveyId();
    }
};
</script>
<template>
    <div class="main">
        <button @click="consoleAll">Console目前的資料</button>
        <h2 class="title">建立問卷</h2>
        <div class="bar">
            <!-- 用v-if去抓 如果為這個路由時 變更樣式 -->
            <RouterLink to="/create/survey_info" class="link" v-if="$route.path === '/create/survey_info'">
                <i class="fa-solid fa-clipboard-question fa-xl"></i>
                問卷資訊
            </RouterLink>
            <RouterLink to="/create/survey_info" class="link" v-else>
                <i class="fa-solid fa-clipboard-question fa-lg"></i>
                問卷資訊
            </RouterLink>

            <RouterLink to="/create/questions" class="link" v-if="$route.path === '/create/questions'">
                <i class="fa-solid fa-comments fa-xl"></i>新增題目與答案
            </RouterLink>
            <RouterLink to="/create/questions" class="link" v-else>
                <i class="fa-solid fa-comments fa-lg"></i>新增題目與答案
            </RouterLink>

            <RouterLink to="/create/check" class="link" v-if="$route.path === '/create/check'">
                <i class="fa-regular fa-square-check fa-xl"></i>確認畫面
            </RouterLink>
            <RouterLink to="/create/check" class="link" v-else>
                <i class="fa-regular fa-square-check fa-lg"></i>確認畫面
            </RouterLink>
        </div>
        <div class="show_step">
            <CSurvey v-if="$route.path === '/create/survey_info'" @saveSurvey="getSurveyData" />
            <CQuestions v-else-if="$route.path === '/create/questions'" @saveQuestions="getQuestionsData" />
            <CCheck v-else-if="$route.path === '/create/check'" @saveCheck="getCheckData" />
        </div>
    </div>
</template>
<style lang="scss" scoped>
.main {

    .title {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: xx-large;
        margin: 20px;
        padding: 20px;
        border-radius: 10px;
        background-color: #c1ffa4;
    }

    .bar {
        display: flex;
        align-content: baseline;
        justify-content: start;
        margin: 20px 10px -1px 10%;

        .fa-xl {
            color: #39b500;
            margin: 0 10px 0 0;
        }

        .fa-lg {
            color: #1B5400;
            margin: 0 10px 0 0;
        }

        .link {
            background-color: #fff;
            margin: 10px 5px 0 5px;
            padding: 20px 20px;
            font-size: 16px;
            border: 2px solid black;
            border-radius: 20px 20px 0 0;
            color: black;
        }

    }

    .show_step {
        background-color: #fff;
        border: 2px solid #000000;
        width: 90%;
        margin: auto;
        margin-bottom: 100px;
    }
}
</style>