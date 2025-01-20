import moment from "moment"; // 시간을 경과 시간 형태로 표시
import "moment/locale/ko";
import axiosApi from "../api/AxiosApi";
import axios from "axios";
moment.locale("ko"); // 한국 시간 적용



const Commons = {
	Capstone: "http://localhost:8111",
	Capstone_URL: "ws://localhost:8111/ws/chat",
	timeFromNow: (timestamp) => {
		return moment(timestamp).fromNow();
	},
	formatDateAndTime: (dateString) => {
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = ("0" + (date.getMonth() + 1)).slice(-2);
		const day = ("0" + date.getDate()).slice(-2);
		const hour = ("0" + date.getHours()).slice(-2);
		const minute = ("0" + date.getMinutes()).slice(-2);
		return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`;
	},
	formatDate: (dateString) => {
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = ("0" + (date.getMonth() + 1)).slice(-2);
		const day = ("0" + date.getDate()).slice(-2);
		return `${year}-${month}-${day}`;
	},
	
	// Token management functions
	removeAccessToken: () => {
		localStorage.removeItem("accessToken");
	},
	removeRefreshToken: () => {
		localStorage.removeItem("refreshToken");
	},
	setAccessToken: (token) => {
		localStorage.setItem("accessToken", token);
	},
	
	// 401 Error handling
	handleUnauthorized: async () => {
		const accessToken = Commons.getAccessToken();
		const refreshToken = Commons.getRefreshToken();
		const config = {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		};
		try {
			const rsp = await axios.post(
				`${Commons.Capstone}/auth/refresh`,
				refreshToken,
				config
			);
			console.log(rsp.data);
			Commons.setAccessToken(rsp.data);
		} catch (e) {
			console.log(e);
			return false;
		}
	},
	
	// Get member ID
	getTokenByMemberId: async () => {
		const accessToken = Commons.getAccessToken();
		try {
			return await axios.get(Commons.Capstone + `/auth/getMemberId`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + accessToken,
				},
			});
		} catch (e) {
			if (e.response.status === 401) {
				await Commons.handleUnauthorized();
				const newToken = Commons.getAccessToken();
				if (newToken !== accessToken) {
					return await axios.get(Commons.Capstone + `/auth/getMemberId`, {
						headers: {
							"Content-Type": "application/json",
							Authorization: "Bearer " + newToken,
						},
					});
				}
			}
		}
	},
	
	// Check login status
	IsLogin: async () => {
		const accessToken = Commons.getAccessToken();
		return await axiosApi.get(
			Commons.Capstone + `/sale/isLogin/${accessToken}`,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + accessToken,
				},
			}
		);
	},
};

export default Commons;
