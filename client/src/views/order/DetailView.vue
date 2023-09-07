<template>
  <div class="card mb-2" v-if="data">
    <img :src="setImage()" class="card-img-top" alt="menu">
    <div class="card-body">
      <h5 class="card-title">{{ data.name }}</h5>
      <p class="card-text">{{ data.description }}</p>
      <!-- <button type="button" class="btn btn-primary" @click="moveRegister">주문하기</button> -->
      <button type="button" class="btn btn-danger" @click="deleteMenu">주문취소</button>
      <button type="button" class="btn btn-outline-primary" @click="moveList">목록으로</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { api } from "@/utils/axios";

const route = useRoute();
const router = useRouter();

const data = ref({});

async function getMenu() {
  const result = await api.menus.findOne(route.params.id);
  console.log(result.data);
  data.value = result.data;
};

function setImage() {
  return `http://54.180.1.16:8080/public/${data.value.image_src}`;
}

function moveRegister() {
  router.push({
    name: "order-update",
    params: { id: route.params.id }
  });
}

async function deleteMenu() {
  const confirmResult = confirm("삭제하시겠습니까?");
  if (confirmResult) {
    const result = await api.menus.delete(route.params.id);
    alert(result.data.message);
    router.push({ name: "orders" });
  }
}

function moveList() {
  router.push({ name: "orders" });
}


getMenu();

</script>

<style lang="scss" scoped></style>