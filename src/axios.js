import axios from "axios";

const instanse = axios.create({
  baseURL: "https://fullstack-backend-d6nr.onrender.com",
});
// при всех запросах проверяй есть ли в локал сторидж токен и запишиего в headers.Авторизацию
instanse.interceptors.request.use((config) => {
  config.headers.Authorization = window.localStorage.getItem("token");
  return config;
});

export default instanse;
