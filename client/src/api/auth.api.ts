import axios from "axios";

import apiURL from "./config";
import type { RegisterFormData } from "../types/auth";

export const api = axios.create({
  baseURL: apiURL + "/auth",
});


export const RegisterUser = async (data: RegisterFormData) => {
  const respData = await api.post("/register", data)
  return respData.data;
};

export const LoginUser = async (email: string, password: string) =>{
  const respData = await api.post("/login", {email, password});
  return respData.data;
}

export const logoutUser = async () =>{
  const respData = await api.post("/logout");
  return respData.data;
}

export const refreshToken = async () => {
const respData = await api.post("/refresh");
return respData.data
}