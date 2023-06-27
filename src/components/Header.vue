<script>
import { RouterLink } from 'vue-router';

export default {
  data() {
    return {
      userName: sessionStorage.getItem("member_id"),
      administrator: sessionStorage.getItem("administrator"),
      isAdministrator: false,
      isMember: false,
      showAdministrator: ""
    }
  },
  mounted() {
  },
  methods: {
  }
}

</script>

<template>
  <body>
    <header>
      <div class="title">
        <div class="logo">
          <a href="/">
            <img src="../../public/logo.png" alt="LOGO">
          </a>
        </div>
        <ul class="nav">
          <li class="">
            <RouterLink to="/" class="to_answer">
              <i class="fa-solid fa-check-to-slot fa-lg" style="color: #8dba79;"></i>
              參與問卷
            </RouterLink>
          </li>
          <li class="">
            <RouterLink to="/create" class="to_create">
              <i class="fa-solid fa-circle-plus fa-lg" style="color: #8dba79;"></i>
              建立問卷
            </RouterLink>
          </li>
        </ul>
      </div>
    </header>
  </body>
</template>


<style lang="scss" scoped>
a {
  color: white;
  font-size: 20px;
}

header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 0 auto;


  img {
    margin: 2px 10px;
    height: 80px;
  }

  .title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #1b5400;
    position: relative;
  }

  .nav {
    display: flex;
    margin: 30px;

    li {
      margin: 0 20px;
    }
  }

}
</style>
