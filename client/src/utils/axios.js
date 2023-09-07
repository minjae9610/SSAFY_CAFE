// API 호출할 내용을 여기에 다 몰아넣을 것
import axios from "axios";

const DOMAIN = import.meta.env.VITE_API_HOST;

// 앞으로 모든 request 요청마다 API_HOST를 자동으로 붙여줄 것
const request = axios.create({
  baseURL: `${DOMAIN}/api`,
});

export const api = {
  // 메뉴 관련 API
  // API_HOST/menus
  menus: {
    findAll: () => request.get("/menus"),
    findOne: (id) => request.get(`/menus/${id}`),
    create: (name, description, file) => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("file", file);
      return request.post("/menus", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    update: (id, name, description) =>
      request.patch(`/menus/${id}`, { name, description }),
    updateImage: (id, file) => {
      const formData = new FormData();
      formData.append("file", file);
      return request.post(`/menus/${id}/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    delete: (id) => request.delete(`/menus/${id}`),
  },
  // 메뉴 관련 API
  // API_HOST/orders
  orders: {
    findAll: () => request.get("/orders"),
    findOne: (id) => request.get(`/orders/${id}`),
    create: (quantity, request_detail, menus_id) =>
      request.post("/orders", { quantity, request_detail, menus_id }),
    update: (id, quantity, request_detail) =>
      request.patch(`/orders/${id}`, { quantity, request_detail }),
    delete: (id) => request.delete(`/orders/${id}`),
  },
};
