import axios from "../utils/axios.customize.ts";

const createPermissionAPI = (data: object) => {
  const URL_BACKEND = "/api/v1/permissions";
  return axios.post(URL_BACKEND, data);
}

const updatePermissionAPI = (data: object) => {
  const URL_BACKEND = "/api/v1/permissions";
  return axios.patch(URL_BACKEND, data);
}

const getPermissionsAPI = (query: string) => {
  const URL_BACKEND = `/api/v1/permissions?${query}`;
  return axios.get(URL_BACKEND);
}

const getPermissionAPI = (id: number) => {
  const URL_BACKEND = `/api/v1/permissions/${id}`;
  return axios.get(URL_BACKEND);
}

const deletePermissionAPI = (id: number) => {
  const URL_BACKEND = `/api/v1/permissions/${id}`;
  return axios.delete(URL_BACKEND);
}

export {createPermissionAPI, updatePermissionAPI, getPermissionsAPI, getPermissionAPI, deletePermissionAPI}