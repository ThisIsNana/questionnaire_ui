
<script>
import { RouterLink, RouterView } from "vue-router";
// import { ref, watch } from 'vue';

import CCreator from "../components/CCreator.vue";
import CSurvey from "../components/CSurvey.vue";
import CQuestions from "../components/CQuestions.vue";
import CCheck from "../components/CCheck.vue";
import CFinished from "../components/CFinished.vue";

export default {
    components: {
        CCreator,
        CSurvey,
        CQuestions,
        CCheck,
        CFinished,
    },
    data() {
        return {
            title: '',
            description: '',
            start_time: '',
            end_time: '',
            ques_opt: [],
            creator_name: '',
            creator_phone: '',
            creator_email: '',
            creator_age: 0,
        }
    },
    methods: {
        getCreatorData(saveCreatorData) {
            this.creator_name = saveCreatorData.creator_name;
            this.creator_phone = saveCreatorData.creator_phone;
            this.creator_email = saveCreatorData.creator_email;
            this.creator_age = saveCreatorData.creator_age;
        },
        getSurveyData(saveSurveyData) {
            this.title = saveSurveyData.title;
            this.description = saveSurveyData.description;
            this.start_time = saveSurveyData.start_time;
            this.end_time = saveSurveyData.end_time;
        },
        getQuestionsData(saveQuestionData) {
            this.ques_opt = saveQuestionData.ques_opt;
        },
        consoleAll() {
            console.log("第一頁");
            console.log(this.creator_name);
            console.log(this.creator_phone);
            console.log(this.creator_email);
            console.log(this.creator_age);
            console.log("第二頁");
            console.log(this.title);
            console.log(this.description);
            console.log(this.start_time);
            console.log(this.end_time);
            console.log("第三頁");
            console.log(this.ques_opt);
        }
    },
};
</script>
<template>
    <div class="main">
        <button @click="consoleAll">Console目前的資料</button>
        <h2 class="title">建立問卷</h2>
        <div class="bar">
            <!-- 用v-if去抓 如果為這個路由時 變更樣式 -->
            <RouterLink to="/create/creator" class="link" v-if="$route.path === '/create/creator'">
                <i class="fa-solid fa-child fa-xl"></i>
                創建者資訊
            </RouterLink>
            <RouterLink to="/create/creator" class="link" v-else>
                <i class="fa-solid fa-child fa-lg"></i>
                創建者資訊
            </RouterLink>

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

            <RouterLink to="/create/finished" class="link" v-if="$route.path === '/create/finished'">
                <i class="fa-solid fa-square-check fa-xl"></i>完成
            </RouterLink>
            <RouterLink to="/create/finished" class="link" v-else>
                <i class="fa-solid fa-square-check fa-lg"></i>完成
            </RouterLink>
        </div>
        <div class="show_step">
            <CCreator v-if="$route.path === '/create/creator'" @saveCreator="getCreatorData" />
            <CSurvey v-else-if="$route.path === '/create/survey_info'" @saveSurvey="getSurveyData" />
            <CQuestions v-else-if="$route.path === '/create/questions'" @saveQuestions="getQuestionsData" />
            <CCheck v-else-if="$route.path === '/create/check'" />
            <CFinished v-else-if="$route.path === '/create/finished'" />
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
        width: 80%;
        margin: auto;
        margin-bottom: 100px;
    }
}
</style>