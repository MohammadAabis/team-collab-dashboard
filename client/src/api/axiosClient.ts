// here automatically refresh the access token when expired.

import axios from "axios";
import { getAccessToken, setAccessToken } from "../utils/tokenMemory";
import { api as axiosClient } from "./auth.api";

// const axiosClient = axios.create({
//   baseURL: "http://localhost:5000",
//   withCredentials: true,  // important for cookies
// });

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





































// import axios from "axios";
// import { useAuth } from "../context/AuthContext";

// const api = axios.create({
//   baseURL: "http://localhost:5000",
//   withCredentials: true, // IMPORTANT for refresh token cookie
// });

// // Create a function hook to attach interceptors inside React
// export const setupAxiosInterceptors = (auth: ReturnType<typeof useAuth>) => {
//   // Request: attach token
//   api.interceptors.request.use((config) => {
//     if (auth.accessToken) {
//       config.headers.Authorization = `Bearer ${auth.accessToken}`;
//     }
//     return config;
//   });

//   // Response: auto refresh token
//   api.interceptors.response.use(
//     (res) => res,
//     async (err) => {
//       const originalRequest = err.config;

//       // If access token expired
//       if (err.response?.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true;

//         try {
//           const refreshResponse = await api.get("/auth/refresh");

//           const newAccessToken = refreshResponse.data.accessToken;

//           auth.login(newAccessToken, auth.user!); // update context token

//           originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//           return api(originalRequest); // retry
//         } catch {
//           auth.logout();
//           return Promise.reject(err);
//         }
//       }

//       return Promise.reject(err);
//     }
//   );
// };

// export default api;
