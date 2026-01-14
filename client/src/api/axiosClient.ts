// here automatically refresh the access token when expired.

import axios from "axios";
import { getAccessToken, setAccessToken } from "../utils/tokenMemory";
import { api as axiosClient } from "./auth.api";


// Attach access token on each request
axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto refresh logic
axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const { data } = await axios.get("/auth/refresh", {
          withCredentials: true,
        });

        setAccessToken(data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;

        return axiosClient(original);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;