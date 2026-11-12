import axios from "axios";

let token = sessionStorage.getItem("krosshire_token");
if (token) token = JSON.parse(token);

const Instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
  headers: {
    Authorization: token || "",
  },
});

export default Instance;
