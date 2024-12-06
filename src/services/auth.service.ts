import axios from "../utils/axios.customize.ts";

const registerUserAPI = (data: object) => {
  const URL_BACKEND = "/api/v1/auth/register";
  return axios.post(URL_BACKEND, data);
}

const loginUserAPI = (data: object) => {
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

const activateUserAPI = (data: object) => {
  const URL_BACKEND = "/api/v1/auth/activate";
  return axios.post(URL_BACKEND, data);
}

const resendMailAPI = (data: { email: string, type: string }) => {
  const URL_BACKEND = "/api/v1/auth/resend-mail";
  return axios.post(URL_BACKEND, data);
}

const resetUserPasswordAPI = (data: object) => {
  const URL_BACKEND = "/api/v1/auth/reset-password";
  return axios.post(URL_BACKEND, data);
}

export {
  registerUserAPI, loginUserAPI, getAccountAPI, logoutUserAPI, refreshTokenAPI,
  activateUserAPI, resendMailAPI, resetUserPasswordAPI
};