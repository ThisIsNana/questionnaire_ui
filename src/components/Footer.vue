<script>
export default {

}
</script>

<template>
    <footer class="frontFooter">
        <div class="logo">
            <a href="/">
                <img src="../../public/logo.png" alt="LOGO">
            </a>
        </div>
        <div>
            <a target="_blank" href="https://github.com/ThisIsNana">
                <p>Designed by NanaWeng 2023</p>
            </a>
            <a target="_blank" href="https://icons8.com">all GIF icon by Icons8</a>
            |
            <a target="_blank" href="https://www.irasutoya.com/">Logo icon by いらすとや</a>
        </div>
    </footer>
</template>

<style lang="scss" scoped>
.frontFooter {
    width: 100%;
    height: 50px;
    background-color: #1b5400;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .logo {
        position: fixed;
        left: 20px;
        bottom: -3px;
    }

    img {
        height: 50px;
    }

    a,
    p {
        color: white;
        text-align: center;
        // margin: 5px;
    }

}
</style>