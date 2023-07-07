<script>
export default {
    data() {
        return {

            //回傳父層的
            surveyData: {
                surveyId: null, //確認是否為更新模式
                title: '',
                description: '',
                startDate: null,
                endDate: null,
            },

            //環境變數API
            findOneSurveyAPI: import.meta.env.VITE_FIND_ONE_SURVEY,
            updateServeyAPI: import.meta.env.VITE_UPDATE_SURVEY,
        }
    },
    created() {
        // 頁面一開始就從session抓出來:)
        const savedSurveyData = localStorage.getItem('saveSurvey');
        if (savedSurveyData) {
            const surveyDatas = JSON.parse(savedSurveyData);
            this.surveyData.surveyId = surveyDatas.surveyId;
            this.surveyData.title = surveyDatas.title;
            this.surveyData.description = surveyDatas.description;
            this.surveyData.startDate = surveyDatas.startDate;
            this.surveyData.endDate = surveyDatas.endDate;
        }

        //設定時區
        const now = new Date();
        // 時區偏移量，以毫秒為單位
        const timezoneOffset = now.getTimezoneOffset() * 60000;

        //設定預設開始/結束時間(如果session有就不設定ㄌ)
        if (!this.surveyData.startDate) {
            this.surveyData.startDate = new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 10);
        }
        if (!this.surveyData.endDate) {
            this.surveyData.endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 - timezoneOffset).toISOString().slice(0, 10);
        }
    },
    methods: {
        saveSession() {
            this.$emit('saveSurvey', this.surveyData);
            localStorage.setItem('saveSurvey', JSON.stringify(this.surveyData));
        },

    },
    watch: {
        'surveyData.title': function (newVal) {
            this.surveyData.title = newVal;
            this.saveSession()
        },
        'surveyData.description': function (newVal) {
            this.surveyData.description = newVal;
            this.saveSession()
        },
        'surveyData.startDate': function (newVal) {
            this.surveyData.startDate = newVal;
            this.saveSession()
        },
        'surveyData.endDate': function (newVal) {
            this.surveyData.endDate = newVal;
            this.saveSession()
        },
    }
}
</script>
<template>
    <div class="main">
        <div class="box">
            <h2>問卷標題</h2>
            <input type="text" name="title" id="title" placeholder="(必填)" v-model="surveyData.title">
        </div>
        <div class="box">
            <h2>問卷描述</h2>
            <textarea name="description" id="description" placeholder="(選填)" v-model="surveyData.description"></textarea>
        </div>
        <hr>
        <div class="box">
            <h2>開始時間</h2>
            <input type="date" name="startDate" id="startDate" placeholder="example@email.com"
                v-model="surveyData.startDate">
        </div>
        <div class="box">
            <h2>結束時間</h2>
            <input type="date" name="endDate" id="endDate" placeholder="" v-model="surveyData.endDate">
        </div>

        <p class="des">※注意：問卷送出後，開始前都可編輯，開始後便不可編輯，但可檢視投票統計。</p>
    </div>
</template>
<style lang="scss" scoped>
.main {
    position: relative;
    padding: 20px;

    hr {
        border: 2px dashed #39b500;
        margin: 30px 0;
    }

    .fa-lg {
        color: #1B5400;
        margin: 0 10px 0 0;
    }

    .box {
        display: flex;

        h2 {
            margin: 20px 5px;
            font-size: 20px;
        }

        input {
            margin: 10px;
            height: 30px;
            width: 60%;
            font-size: 20px;
        }

        textarea {
            margin: 10px;
            height: 100px;
            width: 60%;
            font-size: 20px;
        }

    }

    .des {
        font-size: 14px;
        color: #1B5400;
        font-weight: bolder;
        margin-top: 20px;
    }

    .des_save {
        font-size: 16px;
        color: #b80000;
        font-weight: bolder;
        line-height: 30px;
    }

}
</style>