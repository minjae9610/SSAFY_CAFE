<template>
  <div class="form-wrapper">
      <div>
          <span>menus_id: </span>
          <input type="text" v-model="menus_id">
      </div>
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
import {ref} from "vue";
import {useCommonStore} from '@/stores/common';
import {useRouter, useRoute} from "vue-router";
import {api} from "@/utils/axios";

const router = useRouter();
const route = useRoute();

const menus_id = ref(0);
const quantity = ref(0);
const request_detail = ref("");
const common = useCommonStore();

async function addOrders(){
  if (!menus_id.value || !quantity.value || !request_detail.value){
      alert("빈 값이 있습니다. 내용을 전부 작성해주세요.");
  }
  const result = await api.orders.create(
      menus_id.value, quantity.value, request_detail.value
  );
  console.log(result);
  if (result.data.success){
      alert(result.data.message);
      router.push({name:"orders"});
  }
  if (!result.data.success){
      alert(result.data.message);
  }
}

</script>

<style scoped>
.form-wrapper {
  display: flex;
  flex-direction: column;
  margin-top:50px;
  border: 1px solid black;
  padding: 20px;
}
.form-wrapper>*{
  margin:10px;
}

</style>