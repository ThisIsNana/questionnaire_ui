<script>
export default {
    data() {
        return {
            //畫面預設
            questionSurveyId: 0,
            question: '',
            questionTypeSelect: ['單選', '多選', '簡答'],
            questionType: '單選', //預設顯示單選
            required: false,
            options: '',


            //編輯模式
            is_edit: false,
            editIndex: -1,

            //儲存結果
            question_list: [],

            //更新模式：
            surveyId: 0,

        }
    },
    methods: {
        addQuestionAndEdit() {
            // 新增模式
            if (this.is_edit === false) {
                const questionSurveyId = this.questionSurveyId;
                const question = this.question.trim();
                const questionType = this.questionType;
                const required = this.required;
                const options = this.options.trim();

                if (question === "" || questionType !== "簡答" && options === "") {
                    this.$swal({
                        icon: 'error',
                        title: '錯誤',
                        text: '題目或選擇題之選項不可為空!',
                    });
                    return;
                }
                if (options.startsWith(';') || options.endsWith(';')) {
                    this.$swal({
                        icon: 'error',
                        title: '錯誤',
                        text: '選項開頭或結尾不能為半形分號',
                    });
                    return;
                }
                //加入陣列
                this.question_list.push({
                    questionSurveyId,
                    question,
                    questionType,
                    required,
                    options
                });

                //把資料傳回父層
                this.$emit('saveQuestions', this.question_list)

                //存進session裡:)
                localStorage.setItem('questionData', JSON.stringify(this.question_list))

                this.showAlert()

                //確認新增後就清空輸入框
                this.question = "";
                this.options = "";
                this.questionType = "單選";
                this.required = false;
                console.log(this.question_list)
            }
            // 編輯模式
            else {
                const question = this.question.trim();
                const options = this.options.trim();
                const questionType = this.questionType;

                if (question === "" || questionType !== "簡答" && options === "") {

                    this.$swal({
                        icon: 'error',
                        title: '錯誤',
                        text: '題目或選擇題之選項不可為空!',
                    });
                    return;
                }

                if (options.startsWith(';') || options.endsWith(';')) {
                    this.$swal({
                        icon: 'error',
                        title: '錯誤',
                        text: '選項開頭或結尾不能為半形逗號',
                    });
                    return;
                }

                //確認這個index的項目存在
                if (this.editIndex >= 0 && this.editIndex < this.question_list.length) {

                    const editData = this.question_list[this.editIndex];
                    editData.question = this.question;
                    editData.options = this.options;
                    editData.questionType = this.questionType;
                    editData.required = this.required;

                    //把資料傳回父層
                    this.$emit('saveQuestions', this.question_list)

                    //存進session裡:)
                    localStorage.setItem('questionData', JSON.stringify(this.question_list))

                    //更改"確認修改"
                    const addBtnDOM = document.querySelector('#add_btn');
                    addBtnDOM.innerText = "確認新增"

                    //關閉編輯模式
                    this.is_edit = false;

                    //確認新增後就~清空輸入框
                    this.question = "";
                    this.options = "";
                    this.questionType = "單選";
                    this.required = false;
                } else {
                    console.log("錯誤! ");
                    this.$swal({
                        icon: 'error',
                        title: '錯誤',
                        text: '找不到這個項目',
                    });
                    return;
                }
            }
        },
        // 編輯按鈕按下去
        edit(questionIndex) {
            //更改"新增按鈕"
            const addBtnDOM = document.querySelector('#add_btn');
            addBtnDOM.innerText = "確認修改"

            //把資料放回上面的輸入欄
            const editQuestion = this.question_list[questionIndex];
            this.question = editQuestion.question;
            this.options = editQuestion.options;
            this.questionType = editQuestion.questionType;
            this.required = editQuestion.required;


            //更改is_edit為true進入編輯模式
            this.is_edit = true;
            this.editIndex = questionIndex;
        },
        //刪除選項
        deleteQuestion(questionIndex) {
            this.$swal({
                icon: 'question',
                title: '確認要刪除嗎？',
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonText: '確定刪除',
                cancelButtonText: '考慮一下',
                reverseButtons: true,
                confirmButtonColor: '#39b500',
                cancelButtonColor: '#b80000',
                iconColor: '#1B5400',
            }).then((result) => {
                if (result.isConfirmed === true) {
                    this.question_list.splice(questionIndex, 1);

                    // 創建一個新的陣列並觸發視圖重新渲染
                    this.question_list = [...this.question_list];

                    //把資料傳回父層
                    this.$emit('saveQuestions', this.question_list)

                    //存進session裡:)
                    localStorage.setItem('questionData', JSON.stringify(this.question_list))

                    //清空輸入框
                    this.question = "";
                    this.options = "";
                    this.questionType = "單選";
                    this.required = false;
                    //更改"確認修改"
                    const addBtnDOM = document.querySelector('#add_btn');
                    addBtnDOM.innerText = "確認新增"

                }
            }).catch((err) => {
                console.log(err)
            });


        },
        showAlert() {
            const Toast = this.$swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                // timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', this.$swal.stopTimer);
                    toast.addEventListener('mouseleave', this.$swal.resumeTimer);
                }
            });

            Toast.fire({
                icon: 'success',
                title: '新增成功'
            });
        }
    },
    created() {
        // 頁面一開始就從session抓出來:)
        const savedQuestionData = localStorage.getItem('questionData');
        if (savedQuestionData) {
            const questionData = JSON.parse(savedQuestionData);
            // console.log(questionData)
            this.question_list = questionData;
        }
    },
}
</script>
<template>
    <div class="main">
        <!-- <h1>新增題目及選項!</h1> -->
        <!-- 新增區域 -->
        <div class="add_area">
            <div class="box">
                <h2>新增題目</h2>
                <input type="text" name="question" id="question" placeholder="輸入題目" v-model="question">
            </div>
            <div class="required_box">
                <h2>是否必填</h2>
                <input type="checkbox" name="required" id="required" v-model="required">
            </div>
            <div class="box">
                <h2>問題類型</h2>
                <select v-model="questionType">
                    <option v-for="questype in questionTypeSelect" :key="questype" :value='questype'>
                        {{ questype }}
                    </option>
                </select>
            </div>
            <div class="box" v-if="questionType === '單選' || questionType === '多選'">
                <h2>新增選項</h2>
                <textarea name="options" id="options" placeholder="多個答案請以半型分號「;」分隔。" v-model="options"></textarea>
                <!-- 取值時使用textarea.textContent來忽略換行及tab等格式 -->
            </div>
            <div class="box" v-else>
                <h2>問答題框</h2>
                <textarea readonly name="options" id="options" placeholder="問答題不需填寫選項" v-model="options"></textarea>
            </div>
            <button type="button" @click="addQuestionAndEdit" id="add_btn">確認新增!</button>
        </div>

        <hr>

        <div class="show">
            <table>
                <thead>
                    <tr>
                        <th class="num">序</th>
                        <th class="ques">題目</th>
                        <th class="typ">類型</th>
                        <th class="req">必填</th>
                        <th class="opt">選項</th>
                        <th class="do">操作</th>
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
                        <td class="do">
                            <button type="button" @click="edit(index)" id="edit_btn">
                                <i class="fa-solid fa-pen-to-square fa-xs" style="color: #FFF;"></i> 編輯</button>
                            <button type="button" @click="deleteQuestion(index)" id="delete_btn">
                                <i class="fa-solid fa-trash fa-xs" style="color: #FFF;"></i>
                                刪除</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.main {
    position: relative;
    padding: 20px;

    hr {
        border: 2px dashed #39b500;
        margin: 70px 0 30px 0;
    }

    .add_area {

        position: relative;

        h2,
        input {
            height: 20px;
            margin: 10px;
        }

        .required_box {
            display: flex;

            h2 {
                margin: 20px 5px;
                font-size: 20px;
            }

            input {
                margin: 10px;
                height: 30px;
                width: 5%;
                font-size: 20px;
            }
        }

        .box {
            display: flex;

            h2 {
                margin: 20px 5px;
                font-size: 20px;
            }

            input,
            select {
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

        button {
            height: 50px;
            width: 120px;
            border-radius: 5px;
            background-color: #C1FFA4;
            border-color: #1B5400;
            font-size: 20px;
            font-weight: lighter;
            transition: 0.1s;
            position: absolute;
            right: 30px;


            &:hover {
                background-color: #a6ff7c;
            }

            &:active {
                scale: 1;
                background-color: #b2f692;
            }
        }
    }

    // 表格
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
                        padding: 10px 10px;
                        white-space: pre-wrap;
                        word-break: break-all;
                    }

                    .do {
                        width: 15%;
                        border: 1px solid #1B5400;
                        padding: 10px 10px;
                        text-align: center;

                        #edit_btn {
                            border-radius: 5px;
                            border-color: #267800;
                            background-color: #1B5400;
                            color: white;
                            margin: 0 3px;
                            font-size: 16px;
                            padding: 5px 8px;

                            &:hover {
                                border-color: #298200;
                                background-color: #298200;
                            }
                        }

                        #delete_btn {
                            border-radius: 5px;
                            border-color: #9b0000;
                            background-color: #b80000;
                            color: white;
                            margin: 0 3px;
                            font-size: 16px;
                            padding: 5px 8px;

                            &:hover {
                                background-color: #e20000;
                            }
                        }
                    }

                }

            }
        }
    }

}
</style>