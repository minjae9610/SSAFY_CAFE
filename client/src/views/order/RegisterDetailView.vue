<template>
  <div class="form-wrapper">
    <h5 class="card-title">{{ name }}</h5>
    <p class="card-text">{{ description }}</p>
    <div>
      <span>수량: </span>
      <input type="text" v-model="quantity">
    </div>
    <div>
      <span>요청 사항: </span>
      <input type="text" v-model="request_detail">
    </div>
    <button @click="addOrders">주문 추가하기</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCommonStore } from '@/stores/common';
import { useRoute, useRouter } from 'vue-router';
import { api } from '@/utils/axios';

const route = useRoute();
const router = useRouter();

const name = ref("");
const description = ref("");
const quantity = ref(0);
const request_detail = ref("");
const commonStore = useCommonStore();

async function getOrders() {
  const result = await api.orders.findOne(route.params.id);
  // console.log(result);
  name.value = result.data.name;
  description.value = result.data.description;
  quantity.value = result.data.quantity;
  request_detail.value = result.data.request_detail;
}

async function getMenus() {
  const result = await api.menus.findOne(route.params.id);
  name.value = result.data.name;
  description.value = result.data.description;
}

async function addOrders() {
  if (!quantity.value || !request_detail.value) {
    alert("빈 값이 있습니다. 내용을 전부 작성해주세요.");
  } else if (quantity.value <= 0) {
    alert("수량은 0보다 커야합니다.");
  }
  let result = null;
  if (route.name == "orders-update") {
    result = await api.orders.update(
      route.params.id, quantity.value, request_detail.value
    );
  } else if (route.name == "orders-register-detail") {
    result = await api.orders.create(
      quantity.value, request_detail.value, route.params.id
    );
  }
  // console.log(result);
  if (result.data.success) {
    alert(result.data.message);
    router.push({ name: "orders" });
  }
  if (!result.data.success) {
    alert(result.data.message);
  }
}

if (route.name == "orders-update") {
  commonStore.setTitle("주문 수정하기");
  getOrders();
} else if (route.name == "orders-register-detail") {
  commonStore.setTitle("주문하기");
  getMenus();
}

</script>

<style scoped>
.form-wrapper {
  display: flex;
  flex-direction: column;
  margin-top: 50px;
  border: 1px solid black;
  padding: 20px;
}

.form-wrapper>* {
  margin: 10px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.card-text {
  white-space: pre-line;
}
</style>