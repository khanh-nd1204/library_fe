import axios from "../utils/axios.customize.ts";
import {BookType} from "../types/book.type.ts";

const createBookAPI = (data: BookType) => {
  const URL_BACKEND = "/api/v1/books";
  return axios.post(URL_BACKEND, data);
}

const updateBookAPI = (data: BookType) => {
  const URL_BACKEND = "/api/v1/books";
  return axios.patch(URL_BACKEND, data);
}

const getBooksAPI = (query: string) => {
  const URL_BACKEND = `/api/v1/books?${query}`;
  return axios.get(URL_BACKEND);
}

const getBookAPI = (id: number) => {
  const URL_BACKEND = `/api/v1/books/${id}`;
  return axios.get(URL_BACKEND);
}

const deleteBookAPI = (id: number) => {
  const URL_BACKEND = `/api/v1/books/${id}`;
  return axios.delete(URL_BACKEND);
}

export {createBookAPI, updateBookAPI, getBooksAPI, getBookAPI, deleteBookAPI}