<script>
import { NavigationFailureType } from 'vue-router'

export default {
    data() {
        return {
            //預設值
            add_question: "",
            add_options: "",
            ques_opt: [],
            is_edit: false,
        }
    },
    methods: {
        //將資料傳出去
        saveQuestion() {
            console.log("點擊了儲存按鈕，把資料傳回父層")

            //把資料傳回父層
            this.$emit('questionData', this.ques_opt)

            //存進session裡:)
            localStorage.setItem('questionData', JSON.stringify(this.ques_opt))

            // 移除session
            // localStorage.removeItem('questionData');

        },
        addQuestionAndEdit(questionIndex) {
            // 新增模式
            if (this.is_edit === false) {
                console.log("點下確認新增的按鈕")
                const question = this.add_question;
                const options = this.add_options;

                //加入陣列
                this.ques_opt.push({ question, options });

                //確認新增後就清空輸入框
                this.add_question = "";
                this.add_options = "";

                console.log(this.ques_opt)
            }
            // 編輯模式
            else {
                console.log("點下編輯的按鈕")
                const editData = this.ques_opt[questionIndex];
                editData.question = this.add_question;
                editData.options = this.add_options;

                //更改"確認修改"
                const addBtnDOM = document.querySelector('#add_btn');
                addBtnDOM.innerText = "確認新增"

                //更改"編輯按鈕"
                const editBtnDOM = document.querySelector('#edit_btn')
                editBtnDOM.innerText = "修改";

                //關閉編輯模式
                this.is_edit = false;

                //確認新增後就~清空輸入框
                this.add_question = "";
                this.add_options = "";
            }
        },
        // 編輯按鈕按下去
        edit(questionIndex) {
            //更改"新增按鈕"
            const addBtnDOM = document.querySelector('#add_btn');
            addBtnDOM.innerText = "確認修改"

            //更改"編輯按鈕"
            const editBtnDOM = document.querySelector('#edit_btn')
            editBtnDOM.innerText = "修改中";

            //把資料放回上面的輸入欄
            const editQuestion = this.ques_opt[questionIndex];
            this.add_question = editQuestion.question;
            this.add_options = editQuestion.options;

            //更改is_edit為true進入編輯模式
            this.is_edit = true;
        }
    },
    created() {
        //頁面一開始就從session抓出來:)
        // const savedQuestionData = localStorage.getItem('questionData');
        // if (savedQuestionData) {
        //     const questionData = JSON.parse(savedQuestionData);
        //     // this.end_time = questionData.end_time;
        // }

    },

}
</script>
<template>
    <div class="main">
        <h1>新增題目及選項!</h1>
        <hr>
        <!-- 新增區域 -->
        <div class="add_area">
            <div class="box">
                <h2>新增題目</h2>
                <input type="text" name="add_question" id="add_question" placeholder="輸入題目" v-model="add_question">
            </div>
            <div class="box">
                <h2>新增選項</h2>
                <textarea name="add_options" id="add_options" placeholder="多個答案以半型逗號「,」分隔" v-model="add_options"></textarea>
                <!-- 取值時使用textarea.textContent來忽略換行及tab等格式 -->
            </div>
            <button type="button" @click="addQuestionAndEdit" id="add_btn">確認新增!</button>
        </div>

        <hr>

        <div class="show">
            <table>
                <thead>
                    <tr>
                        <th colspan="4">已新增問題</th>
                    </tr>
                    <tr>
                        <th class="num">序</th>
                        <th class="ques">題目</th>
                        <th class="opt">選項</th>
                        <th class="do">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in ques_opt" :key="index">
                        <td class="num">{{ index + 1 }}</td>
                        <td class="ques">{{ item.question }}</td>
                        <td class="opt">{{ item.options }}</td>
                        <td class="do">
                            <button type="button" @click="edit(index)" id="edit_btn">編輯</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <hr>

        <p class="des_save">※注意：記得按下暫存，否則資料將會遺失。暫存下來後尚未送出都不算建立完成唷!</p>
        <button type="button" class="save_btn" @click="saveQuestion">
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

    .add_area {

        h2,
        input {
            height: 20px;
            margin: 10px;
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

        button {
            height: 40px;
            width: 80px;
            border-radius: 5px;
            background-color: #C1FFA4;
            border-color: #1B5400;
            font-size: 14px;
            font-weight: bolder;
            transition: 0.3s;

            &:hover {
                scale: 1.03;
                background-color: #a6ff7c;
            }

            &:active {
                scale: 1;
                background-color: #b2f692;
            }
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

    // 表格
    .show {
        table {
            border: 1px solid #1B5400;
            margin: auto;

            thead,
            tbody {

                th {
                    padding: 5px 10px;
                }

                tr {
                    border: 1px solid #1B5400;

                    .num,
                    .ques {
                        width: 10%;
                        border: 1px solid #1B5400;
                        padding: 5px 10px;
                        text-align: center;
                    }

                    .opt {
                        width: 71%;
                        border: 1px solid #1B5400;
                        padding: 5px 10px;
                    }

                    .do {
                        width: 10%;
                        border: 1px solid #1B5400;
                        padding: 10px 10px;
                        text-align: center;

                        button {
                            border-radius: 5px;
                            border-color: #1B5400;
                            background-color: #1B5400;
                            color: white;
                        }
                    }

                }

            }
        }
    }

    .des_save {
        font-size: 16px;
        color: #319a00;
        font-weight: bolder;
        line-height: 30px;
    }

}
</style>