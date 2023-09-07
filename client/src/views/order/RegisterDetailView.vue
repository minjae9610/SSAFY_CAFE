<template>
  <div class="form-wrapper">
    <div>
      <span>quantity: </span>
      <input type="text" v-model="quantity">
    </div>
    <div>
      <span>request_detail: </span>
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

const quantity = ref(0);
const request_detail = ref("");
const commonStore = useCommonStore();

async function addOrders() {
  if (!quantity.value || !request_detail.value) {
    alert("빈 값이 있습니다. 내용을 전부 작성해주세요.");
  }
  const result = await api.orders.create(
    quantity.value, request_detail.value, route.params.id
  );
  // console.log(result);
  if (result.data.success) {
    alert(result.data.message);
    router.push({ name: "orders" });
  }
  if (!result.data.success) {
    alert(result.data.message);
  }
}

commonStore.setTitle("주문하기");
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
</style>