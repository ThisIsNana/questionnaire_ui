<script>
import { RouterView } from "vue-router";
import HeaderView from './components/Header.vue';
import FooterView from './components/Footer.vue';

// export default defineComponent({
//   components: { FooterView, HeaderView, HomeBoxView }
// })

export default {
  components: {
    FooterView,
    HeaderView,
  },
  computed: {
  }
}
</script>

<template>
  <div class="container">
    <!-- 通過"完整路徑"作為key值，確保路由發生變化時，RouterView會重新創建和渲染 -->
    <!-- <HeaderView v-if="!isLoginSignup" /> -->
    <!-- <RouterView :key="$route.fullPath" /> -->
    <HeaderView />
    <RouterView />
    <FooterView class="footer" />
  </div>
</template>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
}
</style>
