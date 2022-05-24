import axios from "axios";

const $axios = axios.create({
  baseURL: "https://epitmenyado-backend.herokuapp.com/",
  withCredentials: true,
});

export default $axios;
