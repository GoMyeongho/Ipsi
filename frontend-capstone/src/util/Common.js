import moment from "moment"; // 시간을 경과 시간 형태로 표시
import "moment/locale/ko";
import axiosApi from "../api/AxiosApi";
moment.locale("ko"); // 한국 시간 적용

const Commons = {
	KH_DOMAIN: "http://localhost:8111",
	KH_SOCKET_URL: "ws://localhost:8111/ws/chat",
	timeFromNow: (timestamp) => {
		return moment(timestamp).fromNow();
	},
	formatDate: (dateString) => {
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = ("0" + (date.getMonth() + 1)).slice(-2); // Adds leading 0 if needed
		const day = ("0" + date.getDate()).slice(-2);
		const hour = ("0" + date.getHours()).slice(-2);
		const minute = ("0" + date.getMinutes()).slice(-2);
		return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`;
	},
	
	getAccessToken: () => {
		console.log(localStorage.getItem("accessToken"))
		return localStorage.getItem("accessToken")
	},
	setAccessToken: (token) => {
		localStorage.setItem("accessToken", token)
	},
	getRefreshToken: () => {
		return localStorage.getItem("refreshToken")
	},
	setRefreshToken: (token) => {
		localStorage.setItem("refreshToken",token)
	},
	
	// 401 에러 처리 함수
	handleUnauthorized: async () => {
		console.log("handleUnauthorized!!!")
		const accessToken = Commons.getAccessToken()
		const refreshToken = Commons.getRefreshToken()
		const config = {
			headers: {
				Authorization: `Bearer ${accessToken}`
			},
		};
		try {
			const rsp = await axiosApi.post(
				`${Commons.KH_DOMAIN}/auth/refresh`,
				refreshToken, config
			);
			console.log(rsp.data)
			Commons.setAccessToken(rsp.data)
		} catch (e) {
			console.log(e)
			return false;
		}
	}
};
export default Commons