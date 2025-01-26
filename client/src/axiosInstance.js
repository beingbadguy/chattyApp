import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://chattyapp-gy71.onrender.com",
  baseURL: "http://localhost:3000",
  withCredentials: true,
});
export default axiosInstance;
