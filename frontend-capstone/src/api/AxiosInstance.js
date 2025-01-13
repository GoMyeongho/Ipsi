import axios from "axios";
import Common from "../util/Common";

const AxiosInstance = axios.create({
    baseURL: Common.KH_DOMAIN,
});

AxiosInstance.interceptors.request.use(
    // 요청 인터셉터 추가
    async(config) => {
        const accessToken = Common.getAccessToken();
        config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

AxiosInstance.interceptors.response.use(
    // 응답 인터셉터 추가
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response && error.response.status === 401) {
            const newToken = await Common.handleUnauthorized();
            if (newToken) {
                error.config.headers.Authorization = `Bearer ${Common.getAccessToken()}`;
                return AxiosInstance.request(error.config);
            }
        }
        return Promise.reject(error);
    }
);

export default AxiosInstance;