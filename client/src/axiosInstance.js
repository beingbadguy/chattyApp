import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://chattyapp-gy71.onrender.com",
  baseURL: "http://localhost:8000",
  withCredentials: true,
});
export default axiosInstance;
