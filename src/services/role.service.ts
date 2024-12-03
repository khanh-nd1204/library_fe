import axios from "../utils/axios.customize.ts";
import {RoleType} from "../types/role.type.ts";

const createRoleAPI = (data: RoleType) => {
  const URL_BACKEND = "/api/v1/roles";
  return axios.post(URL_BACKEND, data);
}

const updateRoleAPI = (data: RoleType) => {
  const URL_BACKEND = "/api/v1/roles";
  return axios.patch(URL_BACKEND, data);
}

const getRolesAPI = (query: string) => {
  const URL_BACKEND = `/api/v1/roles?${query}`;
  return axios.get(URL_BACKEND);
}

const getRoleAPI = (id: number) => {
  const URL_BACKEND = `/api/v1/roles/${id}`;
  return axios.get(URL_BACKEND);
}

const deleteRoleAPI = (id: number) => {
  const URL_BACKEND = `/api/v1/roles/${id}`;
  return axios.delete(URL_BACKEND);
}

export {createRoleAPI, updateRoleAPI, getRolesAPI, getRoleAPI, deleteRoleAPI}