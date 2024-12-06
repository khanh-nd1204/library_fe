import axios from "../utils/axios.customize.ts";

const uploadFileAPI = (file: File, folder: string) => {
  const URL_BACKEND = "/api/v1/file/upload";
  const config = {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }
  const data = new FormData();
  data.append("file", file);
  data.append("folder", folder);
  return axios.post(URL_BACKEND, data, config);
}

export {uploadFileAPI}