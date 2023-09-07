import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 주문
    {
      path: "/",
      name: "home",
      component: () => import("@/views/order/MainView.vue"),
    },
    {
      path: "/orders",
      name: "orders",
      component: () => import("@/views/order/ListView.vue"),
    },
    {
      path: "/orders/register",
      name: "orders-register",
      component: () => import("@/views/order/RegisterView.vue"),
    },
    {
      path: "/orders/register/detail/:id",
      name: "orders-register-detail",
      component: () => import("@/views/order/RegisterDetailView.vue"),
    },
    {
      path: "/orders/register/:id",
      name: "orders-update",
      component: () => import("@/views/order/RegisterDetailView.vue"),
    },
    {
      path: "/orders/:id",
      name: "orders-detail",
      component: () => import("@/views/order/DetailView.vue"),
    },

    // 관리자 메뉴
    {
      path: "/admin/home",
      name: "menus-home",
      component: () => import("@/views/admin-menu/MainView.vue"),
    },
    {
      path: "/admin/menus",
      name: "menus",
      component: () => import("@/views/admin-menu/ListView.vue"),
    },
    {
      path: "/admin/menus/register",
      name: "menus-register",
      component: () => import("@/views/admin-menu/RegisterView.vue"),
    },
    // 게시글 업데이트
    {
      path: "/admin/menus/register/:id",
      name: "menus-update",
      component: () => import("@/views/admin-menu/RegisterView.vue"),
    },
    {
      path: "/admin/menus/:id",
      name: "menus-detail",
      component: () => import("@/views/admin-menu/DetailView.vue"),
    },
  ],
});

export default router;
