<script>
import axios from 'axios';
import { RouterLink } from 'vue-router';
import moment from 'moment';
export default {
    data() {
        return {
            surveyList: null,
            today: null,
            showState: '',
            search_state: "",

            //環境變數API
            findAllSurveyAPI: import.meta.env.VITE_FIND_ALL_SURVEY,
            searchSurveyAPI: import.meta.env.VITE_SEARCH_SURVEY,
            searchBySurveyStateAPI: import.meta.env.VITE_SEARCH_BY_SURVEY_STATE,
            //增加loading時間
            isLoading: true,


            search_title: null,
            search_start_date: null,
            search_end_date: null,

            //過濾器清單
            filteredSurveys: [],

            //分頁用
            selectedShowPages: 10, // 預設每頁顯示的筆數
            currentPage: 1, // 目前的頁碼
        }
    },
    methods: {
        getAllSurvey() {
            this.isLoading = true;
            axios({
                method: 'get',
                url: this.findAllSurveyAPI,
            })
                .then((res) => {
                    console.log(res.data);
                    this.surveyList = res.data.surveyList.map((item) => ({
                        ...item,
                        startDate: moment(item.startDate, 'YYYY-MM-DD').toDate(),
                        endDate: moment(item.endDate, 'YYYY-MM-DD').toDate(),
                    })).reverse();
                    this.isLoading = false;
                }).catch((err) => {
                    console.log(err)
                    this.isLoading = false;
                });
        },
        //moment比較時間
        isFutureDate(date) {
            return moment(date).isAfter(moment(), 'millisecond');
        },
        isPastDate(date) {
            return moment(date).add(1, 'day').isBefore(moment(), 'millisecond');
        },
        //篩選功能
        searchFilter() {
            const responseData = {
                search_title: this.search_title,
                search_start_date: this.search_start_date,
                search_end_date: this.search_end_date,
            }
            console.log(responseData);
            axios({
                method: 'post',
                url: this.searchSurveyAPI,
                data: responseData
            }).then((res) => {
                console.log(res.data);
                if (res.data && res.data.surveyList) {
                    this.surveyList = res.data.surveyList.map((item) => ({
                        ...item,
                        startDate: moment(item.startDate, 'YYYY-MM-DD').toDate(),
                        endDate: moment(item.endDate, 'YYYY-MM-DD').toDate(),
                    })).reverse();
                    this.filteredSurveys = this.surveyList;

                    // 手動重設目前頁碼
                    this.changePage(1);


                } else {
                    console.log(res.data.message)
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        //篩選功能
        filterBySurveyState() {
            const responseData = {
                search_start_date: this.search_start_date,
                search_end_date: this.search_end_date,
            }
            console.log(responseData);
            axios({
                method: 'post',
                url: this.searchBySurveyStateAPI,
                data: responseData
            }).then((res) => {
                console.log(res.data);
                if (res.data && res.data.surveyList) {
                    this.surveyList = res.data.surveyList.map((item) => ({
                        ...item,
                        startDate: moment(item.startDate, 'YYYY-MM-DD').toDate(),
                        endDate: moment(item.endDate, 'YYYY-MM-DD').toDate(),
                    })).reverse();;

                    this.filteredSurveys = this.surveyList;

                    // 手動重設目前頁碼
                    this.changePage(1);

                } else {
                    console.log(res.data.message)
                }
            }).catch((err) => {
                console.log(err)
            })
        },
        // [分頁] 切換頁碼
        changePage(page) {
            this.currentPage = page;
        },
        // [分頁] 更新每頁顯示筆數，並將頁碼重設為第 1 頁
        updatePage() {
            this.currentPage = 1;
        },
    },
    watch: {
        search_start_date: {
            handler: function (newVal) {
                this.searchFilter();
            },
            deep: true
        },
        search_end_date: {
            handler: function (newVal) {
                this.searchFilter();
            },
            deep: true
        },
        search_title: {
            handler: function (newVal) {
                this.searchFilter();
            },
            deep: true
        },
        search_state: {
            handler: function (newVal) {
                console.log("進入方法");
                //設定時區
                const now = new Date();
                const timezoneOffset = now.getTimezoneOffset() * 60000;
                if (newVal === "未開始") {
                    this.search_end_date = null;
                    this.search_start_date = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 - timezoneOffset).toISOString().slice(0, 10);
                    this.filterBySurveyState();

                } else if (newVal === "開放中") {
                    this.search_end_date = null;
                    this.search_start_date = new Date(now.getTime() + 0 * 24 * 60 * 60 * 1000 - timezoneOffset).toISOString().slice(0, 10);
                    this.search_end_date = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 - timezoneOffset).toISOString().slice(0, 10);
                    this.filterBySurveyState();

                } else if (newVal === "已結束") {
                    this.search_start_date = null;
                    this.search_end_date = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000 - timezoneOffset).toISOString().slice(0, 10);
                    this.filterBySurveyState();

                } else if (newVal === "") {
                    this.search_start_date = null;
                    this.search_end_date = null;
                    this.searchFilter();
                }
            },
            deep: true
        }
    },
    created() {

        // 先抓到問卷列表
        this.getAllSurvey();


        //設定時區、當下時間
        const now = new Date();
        const timezoneOffset = now.getTimezoneOffset() * 60000;

        this.today = new Date(now.getTime() - timezoneOffset);
        console.log("設定時區:" + this.today);

    },
    computed: {
        formattedStartDate() {
            return (item) => moment(item.startDate).format('YYYY-MM-DD');
        },
        formattedEndDate() {
            return (item) => moment(item.endDate).format('YYYY-MM-DD');
        },

        // [分頁] 計算總頁數
        totalPages() {
            return Math.ceil(this.filteredSurveys.length / this.selectedShowPages);
        },
        // [分頁] 根據目前頁碼和每頁筆數來選取顯示的問卷資料
        displayedSurveys() {
            const startIdx = (this.currentPage - 1) * this.selectedShowPages;
            const endIdx = startIdx + this.selectedShowPages;
            return this.filteredSurveys.slice(startIdx, endIdx);
        },
    },
    // mounted() {
    //     this.searchFilter();
    //     this.filterBySurveyState();
    // },
}
</script>
<template>
    <div v-if="isLoading">
        <div class="full">
            <img src="" alt="">
        </div>
    </div>
    <div v-else>
        <div class="show">
            <div class="filter">
                <div class="box">
                    <h2>問卷標題</h2>
                    <input type="text" name="search_title" id="search_title" placeholder="" v-model="search_title">
                </div>

                <div class="box">
                    <h2>開始時間</h2>
                    <input type="date" name="search_start_date" id="search_start_date" placeholder=""
                        v-model="search_start_date">
                    <h2>結束時間</h2>
                    <input type="date" name="search_end_date" id="search_end_date" placeholder="" v-model="search_end_date">
                    <h2>狀態</h2>
                    <select name="search_state" id="search_state" placeholder="" v-model="search_state">
                        <option value="">全部</option>
                        <option value="未開始">未開始</option>
                        <option value="開放中">開放中</option>
                        <option value="已結束">已結束</option>
                    </select>
                </div>
                <hr>
            </div>

            <div class="color_memo">
                <div>
                    <i class="fa-solid fa-circle fa-lg" style="color: #ffffff;"></i>
                    <span>顏色說明 | </span>
                </div>
                <div>
                    <i class="fa-solid fa-circle fa-lg" style="color: #ff5656;"></i>
                    <span>未開始 | </span>
                </div>
                <div>
                    <i class="fa-solid fa-circle fa-lg" style="color: #39b500;"></i>
                    <span>開放中 | </span>
                </div>
                <div>
                    <i class="fa-solid fa-circle fa-lg" style="color: #343434;"></i>
                    <span>已結束 | </span>
                </div>
                <div class="show_pages">
                    每頁顯示
                    <select name="" id="show_page" v-model="selectedShowPages">
                        <option value="10"> 10 </option>
                        <option value="20"> 20 </option>
                    </select>
                    筆問卷
                </div>
            </div>

            <!-- 表格 -->
            <table>
                <thead>
                    <tr>
                        <th class="num">序</th>
                        <th class="title">題目</th>
                        <th class="state">狀態</th>
                        <th class="start">開始時間</th>
                        <th class="end">結束時間</th>
                        <th class="do"> 使用</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in displayedSurveys" :key="index">
                        <td class="num">{{ index + 1 }}</td>

                        <td class="title" v-if="isFutureDate(item.startDate) || isPastDate(item.endDate)">
                            {{ item.title }}
                        </td>
                        <td class="title" v-else>
                            <RouterLink :to="`answers/${item.surveyId}`">
                                {{ item.title }}
                                <i class="fa-solid fa-angles-right fa-sm" style="color: #39b500;"><span class="go_answer">
                                        去填寫 </span></i>
                            </RouterLink>
                        </td>

                        <td class="state yet" v-if="isFutureDate(item.startDate)">
                            <i class="fa-solid fa-circle fa-lg" style="color: #ff5656;"></i>
                            未開始
                        </td>
                        <td class="state ended" v-else-if="isPastDate(item.endDate)">
                            <i class="fa-solid fa-circle fa-lg" style="color: #343434;"></i>
                            已結束
                        </td>
                        <td class="state voting" v-else>
                            <i class="fa-solid fa-circle fa-lg" style="color: #39b500;"></i>
                            開放中
                        </td>

                        <td class="start">{{ formattedStartDate(item) }}</td>
                        <td class="end">{{ formattedEndDate(item) }}</td>
                        <td class="do">
                            <RouterLink :to="`/create/${item.surveyId}`" v-if="isFutureDate(item.startDate)">
                                <button type="button" id="edit_btn">修改問卷
                                    <i class="fa-solid fa-pen-to-square fa-lg" style="color: #ff5656;"></i>
                                </button>
                            </RouterLink>
                            <RouterLink :to="`result/${item.surveyId}`" v-else>
                                <button type="button" id="chart_btn">統計圖表
                                    <i class="fa-solid fa-chart-pie fa-lg" style="color: #39b500;"></i>
                                </button>
                            </RouterLink>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- 分頁 -->
            <ul>
                <a @click="changePage(1)">
                    <li>
                        第1頁
                    </li>
                </a>

                <!-- 當目前頁數大於10，就會顯示"前十頁"的按鈕 -->
                <li v-if="currentPage > 10" @click="changePage(currentPage - 10)">
                    前10頁
                </li>

                <li v-for="page in Math.min(totalPages, 10)" :key="page" :class="{ 'green-bg': currentPage === page }">
                    <a @click="changePage(page)">
                        <div class="paggge">
                            {{ page }}
                        </div>
                    </a>
                </li>

                <!-- 當總頁數大於10，就會顯示"後十頁"的按鈕 -->
                <li v-if="totalPages > 10" @click="changePage(currentPage + 10)">
                    後10頁
                </li>


                <a @click="changePage(totalPages)">
                    <li>
                        最後頁
                    </li>
                </a>
            </ul>


        </div>
    </div>
</template>
<style lang="scss" scoped>
.show {
    a {
        color: #34a400;
    }

    .filter {
        margin: 20px auto;
        width: 90%;
        // border: 2px dashed #1B5400;

        .box {
            display: flex;

            h2 {
                margin: 20px 5px;
                font-size: 16px;
            }

            input {
                margin: 10px;
                height: 30px;
                padding: 0 5px;
                font-size: 16px;
            }

            #search_title {
                width: 85%;

            }

            #search_start_Date,
            #search_end_Date {
                width: 30%;
                text-align: center;
            }

            #search_state {
                width: 20%;
                margin: 10px;
                height: 35px;
                padding: 5px;
                font-size: 16px;
            }

            input[type="date"] {
                font-family: 'cjkFonts', sans-serif;
            }

        }
    }

    .go_answer {
        font-family: 'cjkFonts', sans-serif;
    }

    .color_memo {
        display: flex;
        position: relative;
        top: 10px;
        left: 5%;
        margin: 30px 0 30px 0;

        span {
            margin: 10px;
        }

        #show_page {
            width: 70px;
            font-size: 16px;
            text-align: center;
        }
    }

    table {
        width: 90%;
        border: 1px solid #1B5400;
        margin: 20px auto;

        thead {
            th {
                padding: 5px 10px;
                background-color: #c9ffb0;
                white-space: pre-wrap;
                word-break: break-all;
                border: 1px solid #1B5400;
                font-size: calc(4px + 1vw);
            }
        }

        tbody {
            tr {
                border: 1px solid #1B5400;
                white-space: pre-wrap;
                word-break: break-all;

                .num {
                    width: 1%;
                    border: 1px solid #1B5400;
                    padding: 5px 5px;
                    text-align: center;
                    white-space: pre-wrap;
                    word-break: break-all;
                    font-size: calc(8px + 1vw);
                }

                .title {
                    width: 12%;
                    border: 1px solid #1B5400;
                    padding: 5px 10px;
                    white-space: pre-wrap;
                    word-break: break-all;

                    &:hover {

                        .fa-angles-right {
                            opacity: 1;
                        }
                    }

                    .fa-angles-right {
                        opacity: 0;
                        transition: opacity 0.1s;
                    }
                }

                .start,
                .end {
                    text-align: center;
                    width: 3%;
                    border: 1px solid #1B5400;
                    padding: 5px 5px;
                    transition: transform 0.3s;
                    transform-origin: center;
                    /* 設置變形原點為元素中心 */
                    white-space: pre-wrap;
                    word-break: break-all;
                    font-size: calc(3px + 1vw);
                }



                .state,
                .do {
                    width: 4%;
                    border: 1px solid #1B5400;
                    padding: 4px 4px;
                    white-space: pre-wrap;
                    word-break: break-all;
                    margin: 5px auto;
                    text-align: center;
                    font-size: calc(5px + 1vw);
                }


                td {
                    white-space: pre-wrap;
                    word-break: break-all;

                    img {
                        height: 20px;
                        width: 20px;
                    }

                }

                #edit_btn,
                #chart_btn {
                    height: 40px;
                    width: 95%;
                    margin: 5px;
                    border-radius: 5px;
                    font-size: calc(4px + 1vw);
                }

                #edit_btn {
                    background-color: #fff;
                    border: 1px dashed #922f2f;
                    color: #ff5656;
                }

                #chart_btn {
                    background-color: #fff;
                    border: 1px dashed #1B5400;
                    color: #39b500;
                }

                .yet {
                    color: #ff5656;
                }

                .voting {
                    color: #39b500;
                }

                .end {
                    color: #343434;
                }
            }

        }
    }

    ul {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 50px;
        font-size: 20px;

        li {
            padding: 10px;
            margin: 10px;
            border: 2px dashed #558541;
            background-color: #e7ffdd;
            cursor: pointer;

            &.green-bg {
                background-color: #b3ffb3;
                color: white;
            }

        }
    }
}
</style>