import axios from "axios";
import AxiosInstance from "./AxiosInstance";
import Commons from "../util/Common";


const baseUrl = Commons.Capstone

const AuthApi = {
	// 로그인
	login : (email, password) => {
	const memberReqDto =
		{
			email: email,
			pwd: password
		};
	return axios.post(`${baseUrl}/auth/login`, memberReqDto)
	},


/* 	// 전체 회원 조회
	memberList: async () => {
		return await AxiosInstance.get(`${baseUrl}/member/list`);
	},
	
	// 개별 회원 조회
	memberInfo: async (email) => {
		return await AxiosInstance.get(`${baseUrl}/member/${email}`);
	}, */


	// 전체 회원 조회
	memberList: async () => {
		try {
		  const response = await AxiosInstance.get(`${baseUrl}/member/list`);
		  return response.data;
		} catch (error) {
		  console.error("전체 회원 조회 중 오류:", error);
		  throw error; // 에러 다시 던짐
		}
	},

	// 개별 회원 조회 (토큰 사용)
	findMemberByToken: async (token) => {
		try {
			const response = await axios.get(`${baseUrl}/member/findMemberByToken`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			return response.data;
		} catch (error) {
			console.error("개별 회원 조회 중 오류:", error);
			throw error; // 에러 다시 던짐
		}
	},

	// 개별 회원 조회
	memberInfo: async (email) => {
		try {
			const response = await axios.get(`${baseUrl}/member/${email}`);
			return response.data;
		} catch (error) {
			console.error("개별 회원 조회 중 오류:", error);
			throw error; // 에러 다시 던짐
		}
	},
};

export default AuthApi