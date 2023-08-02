<script>
import axios from 'axios';
import VueGoogleCharts from 'vue-google-charts';
export default {
    data() {
        return {
            //用網址抓id
            surveyId: null,

            //環境變數API 
            findAnswerAPI: import.meta.env.VITE_FIND_ANSWER_CHART,
            //API抓到的資料:
            survey: null,
            questionList: null,
            responseAnswersList: null,

        }
    },
    component: {
        // googleChart
        VueGoogleCharts,

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
                url: this.findAnswerAPI,
                data: requestdata,
            })
                .then((res) => {
                    console.log(res.data);
                    this.survey = res.data.survey;
                    this.questionList = res.data.questionList;
                    this.responseAnswersList = res.data.responseAnswersList;


                    console.log("問卷:", this.survey, "問題:", this.questionList, "答案:", this.responseAnswersList)

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
<template lang="">
    <div class="main">

        <div class="surveyInfo">
            <h2 class="title">{{survey.title}}</h2>
            <h2 class="description">{{survey.description}}</h2>
            <div class="dates">
                問卷開放時間：{{ survey.startDate }} ～ {{ survey.endDate }}
            </div>
        </div>

        <hr>

        <div class="questions" v-for="ques in questionList">
            <div class="question_title">{{ ques.question}}</div>
            
            <div class="charts">
                <div id="piechart"></div>
                <div id="barchart"></div>
            </div>
        </div>


        <hr>
        <h2 class="title">本頁面還在維修中</h2>
        <h2 class="title">敬請期待</h2>
        <img src="https://4.bp.blogspot.com/-rvtAxy-lIqQ/UgsvHLfNQpI/AAAAAAAAXPw/5Yj4KpNsq3A/s400/mark_koujichu.png" alt="">
    </div>
</template>
<style lang="scss" scoped>
.main {
    text-align: center;
    width: 90%;
    margin: auto;

    .surveyInfo {
        .title {
            font-size: 24px;
            padding: 10px;
            background-color: #ceffb8;
        }

        .description {
            width: 90%;
            margin: auto;
            font-size: 20px;
            text-align: start;
        }

        .dates {
            font-size: 16px;
            margin: 20px;
            padding: 10px;
            border: 2px solid #267800;
            border-radius: 10px;
        }
    }

    .questions {
        .question_title {
            text-align: left;
            margin: 20px;
        }

        // 圖表
        .charts {
            display: flex;
            justify-content: space-evenly;
            align-items: center;

            #piechart,
            #barchart {
                width: 45%;
                height: 200px;
                margin: auto;
                background-color: #ceffb8;
            }
        }
    }


    // 維修
    .title {
        font-size: 32px;
        margin: 20px;
    }
}

@media (max-width: 800px) {
    .questions {

        // 圖表
        .charts {
            display: flex;
            flex-direction: column;

            #piechart,
            #barchart {
                width: 90%;
                height: 300px;
                margin: 10px;
            }
        }
    }
}
</style>