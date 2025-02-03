import axios from "axios";
import Common from "../util/Common";
import store from "../context/Store";
import { logout, setRole } from "../context/redux/PersistentReducer";
import AuthApi from "./AuthApi";

const AxiosInstance = axios.create({
  baseURL: Common.KH_DOMAIN,
});

// 요청 인터셉터: 모든 요청에 AccessToken 추가
AxiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = Common.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 Unauthorized 처리
AxiosInstance.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("🔴 401 Unauthorized 발생! 토큰 갱신 시도...");
      
      try {
        // 토큰 갱신 시도
        const newToken = await Common.handleUnauthorized();
        if (newToken) {
          console.log("🟢 새 토큰으로 요청 재시도");
          error.config.headers.Authorization = `Bearer ${Common.getAccessToken()}`;
          return AxiosInstance.request(error.config);
        }
      } catch (refreshError) {
        console.error("🔴 토큰 갱신 실패:", refreshError);
      }
      
      // 로그인 상태 확인
      try {
        const rsp = await AuthApi.IsLogin();
        if (rsp && rsp.data) {
          console.log("🟢 유저 정보 업데이트:", rsp.data);
          store.dispatch(setRole(rsp.data));
        } else {
          console.log("🔴 로그인 정보 없음, 로그아웃 처리");
          store.dispatch(logout());
        }
      } catch (err) {
        console.error("🔴 로그인 확인 실패:", err);
        store.dispatch(logout());
      }
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;
