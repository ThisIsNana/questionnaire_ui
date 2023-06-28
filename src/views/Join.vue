<script>
import { RouterLink, RouterView } from "vue-router";
// import { ref, watch } from 'vue';

import SurveyList from "../components/JSurveyList.vue";
import Participant from "../components/JParticipant.vue";
import Questions from "../components/JQuestions.vue";
import Result from "../components/JResult.vue";
export default {
    components: {
        SurveyList,
        Participant,
        Questions,
        Result,
    },
    data() {
        return {
            participant_name: '',
            participant_phone: '',
            participant_email: '',
            participant_age: 0,
            survey_id: 0,
            ques_opts: [
                // {
                //     question_id: 0,
                //     select_options: [],
                // }
            ],
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
            console.log(this.ques_opts);
        },
        //收集參加者資料
        getParticipantData(saveParticipantData) {
            this.participant_name = saveParticipantData.participant_name;
            this.participant_phone = saveParticipantData.participant_phone;
            this.participant_email = saveParticipantData.participant_email;
            this.participant_age = saveParticipantData.participant_age;
        },
        //收集投票資料
        getQuestionsData(saveQuestionData) {
            this.ques_opt = saveQuestionData.ques_opt;
            this.survey_id = saveQuestionData.survey_id;
            this.answer_id = saveQuestionData.answer_id;
        },
    },
};

</script>

<template>
    <div class="main">
        <button @click="consoleAll">Console目前的資料</button>
        <h2 class="title">建立問卷</h2>
        <div class="bar">
            <RouterLink to="/join/participant" class="link" v-if="$route.path === '/join/participant'">
                <i class="fa-solid fa-child fa-xl"></i>
                參加者資料
            </RouterLink>
            <RouterLink to="/join/participant" class="link" v-else>
                <i class="fa-solid fa-child fa-lg"></i>
                參加者資料
            </RouterLink>

            <RouterLink to="/join/surveylist" class="link" v-if="$route.path === '/join/surveylist'">
                <i class="fa-solid fa-check-to-slot fa-xl"></i>
                問卷清單
            </RouterLink>
            <RouterLink to="/join/surveylist" class="link" v-else>
                <i class="fa-solid fa-check-to-slot fa-lg"></i>
                問卷清單
            </RouterLink>

            <RouterLink to="/join/questions" class="link" v-if="$route.path === '/join/questions'">
                <i class="fa-solid fa-list-check fa-xl"></i>
                投票
            </RouterLink>
            <RouterLink to="/join/questions" class="link" v-else>
                <i class="fa-solid fa-list-check fa-lg"></i>
                投票
            </RouterLink>

            <RouterLink to="/join/result" class="link" v-if="$route.path === '/join/result'">
                <i class="fa-solid fa-comments fa-xl"></i>
                查看結果
            </RouterLink>
            <RouterLink to="/join/result" class="link" v-else>
                <i class="fa-solid fa-comments fa-lg"></i>
                查看結果
            </RouterLink>
        </div>
        <div class="show_step">
            <!-- @saveCreator="getCreatorData"  -->
            <SurveyList v-if="$route.path === '/join/surveylist'" />
            <Participant v-else-if="$route.path === '/join/participant'" />
            <Questions v-else-if="$route.path === '/join/questions'" />
            <Result v-else-if="$route.path === '/join/result'" />
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