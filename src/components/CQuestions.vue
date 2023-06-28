<script>
export default {
    data() {
        return {
            //預設值
            add_question: "",
            add_options: "",
            ques_opt: [],
            is_edit: false,
            editIndex: -1,
        }
    },
    methods: {
        addQuestionAndEdit() {
            // 新增模式
            if (this.is_edit === false) {
                console.log("點下確認新增的按鈕")
                const question = this.add_question.trim();
                const options = this.add_options.trim();

                if (question === "" || options === "") {
                    this.$swal({
                        icon: 'error',
                        title: '錯誤',
                        text: '格子不可為空!',
                        footer: '每個格子皆為必填'
                    });
                    return;
                }
                if (options.startsWith(',') || options.endsWith(',')) {
                    this.$swal({
                        icon: 'error',
                        title: '錯誤',
                        text: '選項開頭或結尾不能為半形逗號',
                        footer: '可能有東西遺漏了!'
                    });
                    return;
                }
                //加入陣列
                this.ques_opt.push({ question, options });

                this.$swal({
                    icon: 'success',
                    title: '新增成功',
                    text: '清單請往下滑',
                });

                //確認新增後就清空輸入框
                this.add_question = "";
                this.add_options = "";
                console.log(this.ques_opt)
            }
            // 編輯模式
            else {
                console.log("點下確認編輯的按鈕")

                if (this.add_question.trim() === "" || this.add_options.trim() === "") {

                    this.$swal({
                        icon: 'error',
                        title: '錯誤',
                        text: '請勿空白',
                        footer: '每個格子皆為必填!'
                    });
                    return;
                }

                if (this.add_options.startsWith(',') || this.add_options.endsWith(',')) {
                    this.$swal({
                        icon: 'error',
                        title: '錯誤',
                        text: '選項開頭或結尾不能為半形逗號',
                        footer: '可能有東西遺漏了!'
                    });
                    return;
                }

                //確認這個index的項目存在
                if (this.editIndex >= 0 && this.editIndex < this.ques_opt.length) {

                    const editData = this.ques_opt[this.editIndex];
                    editData.question = this.add_question;
                    editData.options = this.add_options;

                    this.$swal({
                        icon: 'success',
                        title: '編輯成功',
                        text: '記得按下暫存資料才會記錄下來喔!',
                    });

                    //更改"確認修改"
                    const addBtnDOM = document.querySelector('#add_btn');
                    addBtnDOM.innerText = "確認新增"

                    //關閉編輯模式
                    this.is_edit = false;

                    //確認新增後就~清空輸入框
                    this.add_question = "";
                    this.add_options = "";
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
            const editQuestion = this.ques_opt[questionIndex];
            this.add_question = editQuestion.question;
            this.add_options = editQuestion.options;

            //更改is_edit為true進入編輯模式
            this.is_edit = true;
            this.editIndex = questionIndex;
        },
        //將資料傳出去
        saveQuestions() {
            console.log("點擊了儲存按鈕，把資料傳回父層")

            this.$swal({
                icon: 'success',
                title: '成功暫存',
                text: '現在可以切換其它頁面了',
                footer: '暫存狀態下，問卷還不算完成唷!'
            });

            //把資料傳回父層
            this.$emit('saveQuestions', this.ques_opt)

            //存進session裡:)
            localStorage.setItem('questionData', JSON.stringify(this.ques_opt))
        },
        //刪除選項
        deleteQuestion(questionIndex) {
            console.log("點下刪除按鈕");
            this.$swal({
                icon: 'question',
                title: '確認要刪除嗎？',
                text: '記得按下暫存資料才會記錄下來喔!',
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonText: '確定刪除',
                cancelButtonText: '我再想想',
                reverseButtons: true,
                confirmButtonColor: '#39b500',
                cancelButtonColor: '#b80000',
                iconColor: '#1B5400',
            }).then((result) => {
                if (result.isConfirmed === true) {
                    if (questionIndex >= 0 && questionIndex < this.ques_opt.length) {
                        this.ques_opt.splice(questionIndex, 1);
                        this.$swal({
                            icon: 'success',
                            title: '成功刪除選項',
                            text: '記得按下暫存資料才會記錄下來喔!',
                        })
                        // 創建一個新的陣列並觸發視圖重新渲染
                        this.ques_opt = [...this.ques_opt];
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
            }).catch((err) => {
                console.log(err)
            });


        },
    },
    created() {
        // 頁面一開始就從session抓出來:)
        const savedQuestionData = localStorage.getItem('questionData');
        if (savedQuestionData) {
            const questionData = JSON.parse(savedQuestionData);
            // console.log(questionData)
            this.ques_opt = questionData;
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
                <input type="text" name="add_question" id="add_question" placeholder="輸入題目" v-model="add_question">
            </div>
            <div class="box">
                <h2>新增選項</h2>
                <textarea name="add_options" id="add_options" placeholder="多個答案以半型逗號「,」分隔，不需添加ABCD或1234"
                    v-model="add_options"></textarea>
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
                            <button type="button" @click="deleteQuestion(index)" id="delete_btn">刪除</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <hr>

        <p class="des_save">※注意：記得按下暫存，否則表格資料及所有修改將會遺失。</p>
        <p class="des_save">※暫存下來後尚未送出都不算建立完成唷!</p>
        <button type="button" class="save_btn" @click="saveQuestions">
            <i class="fa-solid fa-floppy-disk fa-lg"></i>暫存
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
                    white-space: pre-wrap;
                    word-break: break-all;
                }

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
                        width: 30%;
                        border: 1px solid #1B5400;
                        padding: 5px 10px;
                        white-space: pre-wrap;
                        word-break: break-all;
                    }

                    .do {
                        width: 20%;
                        border: 1px solid #1B5400;
                        padding: 10px 10px;
                        text-align: center;

                        #edit_btn {
                            border-radius: 5px;
                            border-color: #1B5400;
                            background-color: #1B5400;
                            color: white;
                            margin: 0 5px;
                        }

                        #delete_btn {
                            border-radius: 5px;
                            border-color: #9b0000;
                            background-color: #b80000;
                            color: white;
                            margin: 0 5px;
                        }
                    }

                }

            }
        }
    }

    .des_save {
        font-size: 16px;
        color: #b80000;
        font-weight: bolder;
        line-height: 30px;
    }

}
</style>