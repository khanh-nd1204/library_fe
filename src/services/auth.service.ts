import axios from "../utils/axios.customize.ts";
import {UserType} from "../types/user.type.ts";

const registerUserAPI = (data: UserType) => {
  const URL_BACKEND = "/api/v1/auth/register";
  return axios.post(URL_BACKEND, data);
}

const loginUserAPI = (data: UserType) => {
  const URL_BACKEND = "/api/v1/auth/login";
  return axios.post(URL_BACKEND, data);
}

const getAccountAPI = () => {
  const URL_BACKEND = "/api/v1/auth";
  return axios.get(URL_BACKEND);
}

const logoutUserAPI = () => {
  const URL_BACKEND = "/api/v1/auth/logout";
  return axios.post(URL_BACKEND);
}

const refreshTokenAPI = () => {
  const URL_BACKEND = "/api/v1/auth/refresh";
  return axios.get(URL_BACKEND);
}

const activateUserAPI = (data: UserType) => {
  const URL_BACKEND = "/api/v1/auth/activate";
  return axios.post(URL_BACKEND, data);
}

const resendMailAPI = (data: { email: string, type: string }) => {
  const URL_BACKEND = "/api/v1/auth/resend-mail";
  return axios.post(URL_BACKEND, data);
}

const resetUserPasswordAPI = (data: UserType) => {
  const URL_BACKEND = "/api/v1/auth/reset-password";
  return axios.post(URL_BACKEND, data);
}

export {
  registerUserAPI, loginUserAPI, getAccountAPI, logoutUserAPI, refreshTokenAPI,
  activateUserAPI, resendMailAPI, resetUserPasswordAPI
};