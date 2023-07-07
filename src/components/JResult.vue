<script>
import axios from 'axios';
export default {
    data() {
        return {
            //用網址抓id
            surveyId: null,
        }
    },
    created() {
        //取網址上的surveyId+加到session裡
        const survey_id = this.$route.params.surveyId;

        if (typeof survey_id !== 'undefined' && survey_id !== null) {
            // const requestdata = {
            // search_survey_id: survey_id,
            // }
            // axios({
            //     method: 'post',
            //     url: this.findOneSurveyAPI,
            //     data: requestdata,
            // })
            //     .then((res) => {

            //     }).catch((err) => {
            //         console.log(err)
            //     });
        } else {
            // surveyid 不存在
            console.log("新增模式");
            this.surveyId = null;
        }
    },

}
</script>
<template lang="">
    <div class="main">
        <h2 class="title">本頁面還在維修中</h2>
        <h2 class="title">敬請期待</h2>
        <img src="https://4.bp.blogspot.com/-rvtAxy-lIqQ/UgsvHLfNQpI/AAAAAAAAXPw/5Yj4KpNsq3A/s400/mark_koujichu.png" alt="">
    </div>
</template>
<style lang="scss" scoped>
.main {
    text-align: center;
    width: 80%;
    margin: auto;

    .title {
        font-size: 32px;
        margin: 50px;
    }
}
</style>