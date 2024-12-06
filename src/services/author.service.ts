import axios from "../utils/axios.customize.ts";

const createAuthorAPI = (data: object) => {
  const URL_BACKEND = "/api/v1/authors";
  return axios.post(URL_BACKEND, data);
}

const updateAuthorAPI = (data: object) => {
  const URL_BACKEND = "/api/v1/authors";
  return axios.patch(URL_BACKEND, data);
}

const getAuthorsAPI = (query: string) => {
  const URL_BACKEND = `/api/v1/authors?${query}`;
  return axios.get(URL_BACKEND);
}

const getAuthorAPI = (id: number) => {
  const URL_BACKEND = `/api/v1/authors/${id}`;
  return axios.get(URL_BACKEND);
}

const deleteAuthorAPI = (id: number) => {
  const URL_BACKEND = `/api/v1/authors/${id}`;
  return axios.delete(URL_BACKEND);
}

export {createAuthorAPI, updateAuthorAPI, getAuthorsAPI, getAuthorAPI, deleteAuthorAPI}