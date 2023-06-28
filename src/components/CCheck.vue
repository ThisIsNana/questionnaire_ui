<script>
export default {
    data() {
        return {
            //預設值
            title: '',
            description: '',
            start_time: '',
            end_time: '',
            creator_name: '',
            creator_phone: '',
            creator_email: '',
            creator_age: 0,
            ques_opt: []
        }
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

        const savedCreatorData = localStorage.getItem('creatorData');
        if (savedCreatorData) {
            const creatorData = JSON.parse(savedCreatorData);
            this.creator_name = creatorData.creator_name;
            this.creator_phone = creatorData.creator_phone;
            this.creator_email = creatorData.creator_email;
            this.creator_age = creatorData.creator_age;
        }

        const savedQuestionData = localStorage.getItem('questionData');
        if (savedQuestionData) {
            const questionData = JSON.parse(savedQuestionData);
            // console.log(questionData)
            this.ques_opt = questionData;
        }
    },
    methods: {
        //確認送出前是否空白
        checkEmpty() {
            console.log("點下了送出按鈕")
            if (this.creator_name === "" ||
                this.creator_email === "" ||
                this.creator_phone === "" ||
                this.creator_age <= 0 ||
                this.ques_opt === [] ||
                this.title === "" ||
                this.description === "" ||
                this.start_time === "" ||
                this.end_time === "") {
                this.$swal({
                    icon: 'error',
                    title: '錯誤!',
                    text: '有項目空白，請檢查內容!',
                });
                return;
            }

            this.$swal({
                icon: 'success',
                title: '成功送出問卷',
                text: '可以從投票頁查看剛剛新增的問卷!',
            });

            //清除session
            localStorage.removeItem('creatorData');
            localStorage.removeItem('surveyData');
            localStorage.removeItem('questionData');
        },
    }

}
</script>
<template>
    <div class="main">
        <p class="des_save">還沒完成喔! 請確認下面資訊後按下送出!</p>
        <hr>
        <h1>創建者資訊</h1>
        <div class="box">
            <h2>創建者姓名</h2>
            <h3>{{ creator_name }}</h3>
        </div>
        <div class="box">
            <h2>手機</h2>
            <h3>{{ creator_phone }}</h3>
        </div>
        <div class="box">
            <h2>信箱</h2>
            <h3>{{ creator_email }}</h3>
        </div>
        <div class="box">
            <h2>年齡</h2>
            <h3>{{ creator_age }}</h3>
        </div>
        <RouterLink to="/create/creator" class="button">修改創建者資訊</RouterLink>

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
            <h3>{{ start_time }}</h3>
        </div>
        <div class="box">
            <h2>結束時間</h2>
            <h3>{{ end_time }}</h3>
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
                        <th class="opt">選項</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in ques_opt" :key="index">
                        <td class="num">{{ index + 1 }}</td>
                        <td class="ques table-content">{{ item.question }}</td>
                        <td class="opt table-content">{{ item.options }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <RouterLink to="/create/questions" class="button">修改題目與答案</RouterLink>
        <hr>
        <p class="des_save">都確認正確了嗎？記得按下送出!</p>
        <button type="button" id="sendToDB" @click="checkEmpty">完 成 送 出</button>
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

            thead {
                th {
                    padding: 5px 10px;
                    background-color: #c9ffb0;
                    white-space: pre-wrap;
                    word-break: break-all;
                    border: 1px solid #1B5400;
                }
            }

            tbody {
                tr {
                    border: 1px solid #1B5400;
                    white-space: pre-wrap;
                    word-break: break-all;

                    .num {
                        width: 5%;
                        border: 1px solid #1B5400;
                        padding: 5px 10px;
                        text-align: center;
                        white-space: pre-wrap;
                        word-break: break-all;
                    }

                    .opt,
                    .ques {
                        width: 45%;
                        border: 1px solid #1B5400;
                        padding: 5px 10px;
                        white-space: pre-wrap;
                        word-break: break-all;
                    }

                    td {
                        white-space: pre-wrap;
                        word-break: break-all;
                    }
                }

            }
        }
    }

    .des_save {
        font-size: 28px;
        color: #b80000;
        font-weight: bolder;
        line-height: 30px;
        text-align: center;
    }

    #sendToDB {
        background-color: #40c900;
        border: #1B5400;
        height: 50px;
        width: 200px;
        color: white;
        font-size: 24px;
        font-weight: bolder;
        border-radius: 10px;
        margin: 20px auto;

    }
}
</style>