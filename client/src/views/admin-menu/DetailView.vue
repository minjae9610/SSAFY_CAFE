<template>
  <div class="card mb-2" v-if="data">
    <img :src="setImage()" class="card-img-top" alt="menu">
    <div class="card-body">
      <h5 class="card-title">{{ data.name }}</h5>
      <p class="card-text">{{ data.description }}</p>
      <button type="button" class="btn btn-primary" @click="moveRegister">
        수정하기
      </button>
      <button type="button" class="btn btn-danger" @click="deleteMenu">
        삭제
      </button>
      <button type="button" class="btn btn-outline-primary" @click="moveList">
        목록
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '@/utils/axios';

const route = useRoute();
const router = useRouter();

const data = ref(null);

async function getMenu() {
  const result = await api.menus.findOne(route.params.id);
  // console.log(result.data);
  data.value = result.data;
};

function setImage() {
  return `${import.meta.env.VITE_API_HOST}/public/${data.value.image_src}`;
}

function moveRegister() {
  router.push({ name: "menus-update", params: { id: route.params.id } });
}

async function deleteMenu() {
  const confirmResult = confirm("삭제하시겠습니까?");
  if (confirmResult) {
    const result = await api.menus.delete(route.params.id);
    alert(result.data.message);
    router.push({ name: "menus" });
  }
}

function moveList() {
  router.push({ name: "menus" });
}

getMenu();
</script>

<style scoped>
.card {
  width: 100%;
  margin-bottom: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
}

.card-body {
  padding: 1.25rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.card-text {
  white-space: pre-line;
}
</style>