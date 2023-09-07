<template>
  <RouterLink :to="{name:`orders-register`}">
  <button type="button" class="order-button btn btn-outline-dark w-100"> 
      주문 추가하기
  </button>
</RouterLink>
  <ul>
      <li v-for="order in orders" :key="order.id" @click="moveDetail(order.id)">
      <div class="order-container">
          <div class="order-info-wrapper">
              <h2 class="order-name">{{ order.name }}</h2>
              <p class="order-quantity"> 수량 : {{ order.quantity }} |  요청사항 : {{ order.request_detail }}</p>
          </div>
      </div>

      </li>
  </ul>
</template>

<script setup>
import {ref} from "vue";
import {useCommonStore} from "@/stores/common";
import {api} from "@/utils/axios"
import { RouterLink } from "vue-router";
import {useRouter} from "vue-router";
import router from "../../router";

const commonStore = useCommonStore();
const orders = ref([]);

async function getOrders(){
  const result = await api.orders.findAll();
  // console.log(result);
  orders.value = result.data;
}

function moveDetail(id){
  router.push({
      name:"orders-detail",
      params: {id:id},
  });
}

commonStore.setTitle("주문 목록");
getOrders();



</script>

<style scoped>
  .order-container {
      /* display: flex; */
      /* align-items: center; */
      border-bottom: 3px solid black;
      padding:10px;
  }
  .order-info-wrapper {
      margin: 0 auto;
      /* text-align: center; */
  }
  .order-name{
      font-size:25px;
      font-weight:bold;
  }
  .order-description {
      padding-top: 10px;
  }
</style>