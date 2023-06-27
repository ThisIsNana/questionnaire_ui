<script>
export default {
    data() {
        return {
            //預設值
            title: '',
            description: '',
            start_time: '',
            end_time: '' //預設開始加七天
        }
    },
    methods: {
        //將資料傳出去
        saveSurvey() {
            const surveyData = {
                title: this.title,
                description: this.description,
                start_time: this.start_time,
                end_time: this.end_time,
            }
            //把資料傳回父層
            this.$emit('saveSurvey', surveyData)

            //存進session裡:)
            localStorage.setItem('surveyData', JSON.stringify(surveyData))

            // 移除session
            // localStorage.removeItem('surveyData');

        },
    },
    created() {
        //頁面一開始就從session抓出來:)
        const savedSurveyData = localStorage.getItem('surveyData');
        if (savedSurveyData) {
            const surveyData = JSON.parse(savedSurveyData);
            this.title = surveyData.title;
            this.description = surveyData.description;
            this.start_time = surveyData.start_time;
            this.end_time = surveyData.end_time;
        }

        //設定時區
        const now = new Date();
        // 時區偏移量，以毫秒為單位
        const timezoneOffset = now.getTimezoneOffset() * 60000;

        //設定預設開始/結束時間
        this.start_time = new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 16);
        this.end_time = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 - timezoneOffset).toISOString().slice(0, 16);
    }

}
</script>
<template>
    <div class="main">
        <h1>問卷資訊</h1>
        <hr>
        <div class="box">
            <h2>問卷標題</h2>
            <input type="text" name="title" id="title" placeholder="早餐吃什麼？" v-model="title">
        </div>
        <div class="box">
            <h2>問卷描述</h2>
            <textarea name="description" id="description" placeholder="中式西式日式台式，你喜歡哪一種？" v-model="description"></textarea>
        </div>
        <hr>
        <div class="box">
            <h2>開始時間</h2>
            <input type="datetime-local" name="start_time" id="start_time" placeholder="example@email.com"
                v-model="start_time">
        </div>
        <div class="box">
            <h2>結束時間</h2>
            <input type="datetime-local" name="end_time" id="end_time" placeholder="" v-model="end_time">
        </div>

        <p class="des">※注意：問卷送出後，開始前都可編輯，開始後便不可編輯，但可檢視投票統計。</p>
        <hr>
        <p class="des_save">※注意：記得按下暫存，否則資料將會遺失。暫存下來後尚未送出都不算建立完成唷!</p>
        <button type="button" class="save_btn" @click="saveCreator">
            <i class="fa-solid fa-floppy-disk fa-lg"></i>儲存
        </button>
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

    .save_btn {
        position: absolute;
        bottom: 20px;
        right: 20px;
        height: 40px;
        width: 100px;
        border-radius: 5px;
        background-color: #C1FFA4;
        border-color: #1B5400;
        font-size: 20px;
        font-weight: bolder;
        transition: 0.3s;

        &:hover {
            scale: 1.05;
            background-color: #a6ff7c;
        }

        &:active {
            scale: 1;
            background-color: #b2f692;
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
        color: #319a00;
        font-weight: bolder;
        line-height: 30px;
    }

}
</style>