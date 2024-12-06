import axios from "../utils/axios.customize.ts";

const createUserAPI = (data: object) => {
  const URL_BACKEND = "/api/v1/users";
  return axios.post(URL_BACKEND, data);
}

const updateUserAPI = (data: object) => {
  const URL_BACKEND = "/api/v1/users";
  return axios.patch(URL_BACKEND, data);
}

const getUsersAPI = (query: string) => {
  const URL_BACKEND = `/api/v1/users?${query}`;
  return axios.get(URL_BACKEND);
}

const getUserAPI = (id: number) => {
  const URL_BACKEND = `/api/v1/users/${id}`;
  return axios.get(URL_BACKEND);
}

const deleteUserAPI = (id: number) => {
  const URL_BACKEND = `/api/v1/users/${id}`;
  return axios.delete(URL_BACKEND);
}

const changeUserPasswordAPI = (data: object) => {
  const URL_BACKEND = "/api/v1/users/change-password";
  return axios.post(URL_BACKEND, data);
}

export {createUserAPI, updateUserAPI, getUsersAPI, getUserAPI, deleteUserAPI, changeUserPasswordAPI}