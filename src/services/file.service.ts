import axios from "../utils/axios.customize.ts";

const uploadFileAPI = (file: string, folder: string) => {
  const URL_BACKEND = "/api/v1/file/upload";
  const config = {
    headers: {
      "folder": folder,
      "Content-Type": "multipart/form-data"
    }
  }
  const data = new FormData();
  data.append("file", file);
  return axios.post(URL_BACKEND, data, config);
}

export {uploadFileAPI}