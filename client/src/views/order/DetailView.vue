<template>
  <div class="card mb-2" v-if="data">
    <div class="card-body">
      <h5 class="card-title">{{ data.name }}</h5>
      <p class="card-text">{{ data.description }}</p>
      <p class="card-text">
        수량: {{ data.quantity }}
        <br>
        요청 사항: {{ data.request_detail }}
      </p>
      <button type="button" class="btn btn-danger" @click="deleteMenu">주문취소</button>
      <button type="button" class="btn btn-outline-primary" @click="moveList">목록으로</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { api } from "@/utils/axios";
import { useCommonStore } from '@/stores/common'

const commonStore = useCommonStore();
const route = useRoute();
const router = useRouter();

const data = ref();

async function getMenu() {
  const result = await api.orders.findOne(route.params.id);
  // console.log(result.data);
  data.value = result.data;
};

async function deleteMenu() {
  const confirmResult = confirm("삭제하시겠습니까?");
  if (confirmResult) {
    const result = await api.orders.delete(route.params.id);
    alert(result.data.message);
    router.push({ name: "orders" });
  }
}

function moveList() {
  router.push({ name: "orders" });
}

commonStore.setTitle('주문 상세 조회');
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