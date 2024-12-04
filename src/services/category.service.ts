import axios from "../utils/axios.customize.ts";
import {CategoryType} from "../types/category.type.ts";

const createCategoryAPI = (data: CategoryType) => {
  const URL_BACKEND = "/api/v1/categories";
  return axios.post(URL_BACKEND, data);
}

const updateCategoryAPI = (data: CategoryType) => {
  const URL_BACKEND = "/api/v1/categories";
  return axios.patch(URL_BACKEND, data);
}

const getCategoriesAPI = (query: string) => {
  const URL_BACKEND = `/api/v1/categories?${query}`;
  return axios.get(URL_BACKEND);
}

const getCategoryAPI = (id: number) => {
  const URL_BACKEND = `/api/v1/categories/${id}`;
  return axios.get(URL_BACKEND);
}

const deleteCategoryAPI = (id: number) => {
  const URL_BACKEND = `/api/v1/categories/${id}`;
  return axios.delete(URL_BACKEND);
}

export {createCategoryAPI, updateCategoryAPI, getCategoriesAPI, getCategoryAPI, deleteCategoryAPI}