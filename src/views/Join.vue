<script>
import { RouterLink, RouterView } from "vue-router";
// import { ref, watch } from 'vue';

import SurveyList from "../components/JSurveyList.vue";
import Answers from "../components/JAnswers.vue";
import Result from "../components/JResult.vue";
export default {
    components: {
        SurveyList,
        Answers,
        Result,
    },
    data() {
        return {
            participant_name: '',
            participant_phone: '',
            participant_email: '',
            participant_age: 0,
            survey_id: 0,
            answer_id: 0,
        };
    },
    methods: {
        //查看所有數據
        consoleAll() {
            console.log("參加者");
            console.log(this.participant_name);
            console.log(this.participant_phone);
            console.log(this.participant_email);
            console.log(this.participant_age);
            console.log("投票頁");
            console.log(this.answer_id);
            console.log(this.survey_id);
        },
        //收集參加者資料
        getParticipantData(saveParticipantData) {
            this.participant_name = saveParticipantData.participant_name;
            this.participant_phone = saveParticipantData.participant_phone;
            this.participant_email = saveParticipantData.participant_email;
            this.participant_age = saveParticipantData.participant_age;
        },
        clear() {
            this.$emit('saveSurvey', "")
            this.$emit('saveQuestions', "")
            this.$emit('saveCheck', "")
            localStorage.removeItem('saveSurvey');
            localStorage.removeItem('questionData');
            localStorage.removeItem('checkData');
        },
    },
    //一進來就轉跳清單頁
    created() {
        this.clear(); //切換頁面會刪除所有session
        console.log("建立問卷的資料session已清除")
        this.$router.push('/join/surveylist');
    }
};

</script>

<template>
    <div class="main">
        <button @click="consoleAll">Console目前的資料</button>
        <h2 class="title">參與問卷</h2>
        <div class="bar">
            <RouterLink to="/join/surveylist" class="link" v-if="$route.name === 'surveylist'">
                <i class="fa-solid fa-rectangle-list fa-xl"></i>
                問卷清單
            </RouterLink>
            <RouterLink to="/join/surveylist" class="link" v-else>
                <i class="fa-solid fa-rectangle-list fa-lg"></i>
                問卷清單
            </RouterLink>
        </div>
        <div class="show_step">
            <SurveyList v-if="$route.name === 'surveylist'" />
            <Answers v-else-if="$route.name === 'answers'" />
            <Result v-else-if="$route.name === 'result'" />
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
        margin: 20px 10px -2px 10%;

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