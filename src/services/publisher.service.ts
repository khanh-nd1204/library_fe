import axios from "../utils/axios.customize.ts";
import {PublisherType} from "../types/publisher.type.ts";

const createPublisherAPI = (data: PublisherType) => {
  const URL_BACKEND = "/api/v1/publishers";
  return axios.post(URL_BACKEND, data);
}

const updatePublisherAPI = (data: PublisherType) => {
  const URL_BACKEND = "/api/v1/publishers";
  return axios.patch(URL_BACKEND, data);
}

const getPublishersAPI = (query: string) => {
  const URL_BACKEND = `/api/v1/publishers?${query}`;
  return axios.get(URL_BACKEND);
}

const getPublisherAPI = (id: number) => {
  const URL_BACKEND = `/api/v1/publishers/${id}`;
  return axios.get(URL_BACKEND);
}

const deletePublisherAPI = (id: number) => {
  const URL_BACKEND = `/api/v1/publishers/${id}`;
  return axios.delete(URL_BACKEND);
}

export {createPublisherAPI, updatePublisherAPI, getPublishersAPI, getPublisherAPI, deletePublisherAPI}