<script>
export default {
    data() {
        return {
            creator_name: '',
            creator_phone: '',
            creator_email: '',
            creator_age: 0,
        }
    },
    methods: {
        //按下儲存
        saveCreator() {
            const creatorData = {
                creator_name: this.creator_name,
                creator_phone: this.creator_phone,
                creator_email: this.creator_email,
                creator_age: this.creator_age,
            }

            //把資料傳回父層
            this.$emit('saveCreator', creatorData)

            //存進session裡:)
            localStorage.setItem('creatorData', JSON.stringify(creatorData))

        },
    },
    created() {
        //從session抓出來:)
        const savedCreatorData = localStorage.getItem('creatorData');
        if (savedCreatorData) {
            const creatorData = JSON.parse(savedCreatorData);
            this.creator_name = creatorData.creator_name;
            this.creator_phone = creatorData.creator_phone;
            this.creator_email = creatorData.creator_email;
            this.creator_age = creatorData.creator_age;
        }
    }
}
</script>
<template>
    <div class="main">
        <h1>創建者資訊</h1>
        <div class="box">
            <h2>姓名</h2>
            <input type="text" name="creator_name" id="creator_name" placeholder="王小明" v-model="creator_name">
        </div>
        <div class="box">
            <h2>手機</h2>
            <input type="text" name="creator_phone" id="creator_phone" placeholder="0900123456" v-model="creator_phone">
        </div>
        <div class="box">
            <h2>信箱</h2>
            <input type="text" name="creator_email" id="creator_email" placeholder="example@email.com"
                v-model="creator_email">
        </div>
        <div class="box">
            <h2>年齡</h2>
            <input type="number" name="creator_age" id="creator_age" placeholder="25" v-model="creator_age">
        </div>
        <hr>
        <p class="des_save">※注意：記得按下暫存，否則資料將會遺失。暫存下來後尚未送出都不算建立完成唷!</p>
        <button type="button" class="save_btn" @click="saveCreator">
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

    .fa-lg {
        color: #1B5400;
        margin: 0 10px 0 0;
    }

    .box {
        display: flex;

        h2 {
            margin: 30px 5px;
            font-size: 20px;
        }

        input {
            margin: 20px;
            height: 30px;
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

    .des_save {
        font-size: 16px;
        color: #319a00;
        font-weight: bolder;
        line-height: 30px;
    }
}
</style>