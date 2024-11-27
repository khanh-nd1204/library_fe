import axios from "axios";
import NProgress from 'nprogress';
import {refreshTokenAPI} from "../services/auth.service.ts";
import {ResponseType} from "../types/response.type.ts";

NProgress.configure({ showSpinner: false, trickleSpeed: 100 });

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
});

instance.interceptors.request.use(config => {
    NProgress.start();
    const token = window?.localStorage?.getItem('accessToken');
    if (token) config.headers.Authorization = 'Bearer ' + token;
    return config;
}, error => {
    NProgress.done();
    return Promise.reject(error);
});

instance.interceptors.response.use(response => {
    NProgress.done();
    return response?.data || response;
}, async error => {
    NProgress.done();
    const { config, response } = error;
    if (response?.status === 401 && !config.headers['x-no-retry'] && !["/login", "/register"].includes(window.location.pathname)) {
        const res: ResponseType = await refreshTokenAPI();
        if (res && res.data) {
            window.localStorage.setItem('accessToken', res.data.accessToken);
            config.headers.Authorization = 'Bearer ' + res.data.accessToken;
            config.headers['x-no-retry'] = 'true';
            return instance.request(config);
        } else {
            console.error(res.message);
        }
    }
    return response?.data || error;
});

export default instance
