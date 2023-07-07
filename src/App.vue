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
