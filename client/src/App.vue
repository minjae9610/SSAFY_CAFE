<template>
  <div id="app">
    <header class="app-header">
      <h2>{{ commonStore.getTitle() }}</h2>
    </header>

    <main class="app-main">
      <RouterView />
    </main>

    <footer class="app-footer">
      <div class="footer-text">All right reserved</div>
      <Router-link :to="{ name: 'menus-home' }">관리자페이지(메뉴)</Router-link>
      <br>
      <Router-link :to="{ name: 'home' }">메인페이지(주문)</Router-link>
    </footer>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import { useCommonStore } from '@/stores/common'

const commonStore = useCommonStore();
commonStore.setTitle('SSAFY-CAFE');
</script>

<style scoped>
.app-header,
.app-footer {
  border-top: 2px solid gray;
  border-bottom: 2px solid gray;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header,
.app-footer {
  text-align: center;
}

.app-main {
  flex: 1;
}
</style>