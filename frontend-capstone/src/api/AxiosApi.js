import axios from "axios";
import Commons from "../util/Common";
axios.defaults.withCredentials = true; // 쿠키를 요청에 포함
const Capstone = "http://localhost:8111";

const AxiosApi = {
	
	// 채팅방 목록 가져오기
	chatList: async () => {
		try {
			return await axios.get(`${Capstone}/chat/roomList`);
		} catch (error) {
			console.error("Error fetching chat list:", error);
			throw error;
		}
	},
	
	// 채팅방 생성하기
	chatCreate: async (name, personCnt) => {
		try {
			const chat = { name, personCnt };
			return await axios.post(`${Capstone}/chat/new`, chat);
		} catch (error) {
			console.error("Error creating chat room:", error);
			throw error;
		}
	},
	
	// 채팅방 정보 가져오기
	chatDetail: async (roomId) => {
		try {
			return await axios.get(`${Capstone}/chat/room/${roomId}`);
		} catch (error) {
			console.error("Error fetching chat details:", error);
			throw error;
		}
	},
	
	// 해당 채팅방의 이전 채팅 내역 가져오기
	chatHistory: async (roomId) => {
		try {
			const response = await axios.get(`${Capstone}/chat/message/${roomId}`);
			return response.data?.messages || response.data;  // 메시지 목록을 반환
		} catch (error) {
			console.error("Error fetching chat history:", error);
			throw error;
		}
	},
	
	// 로그인
	login: async (email, pwd) => {
		try {
			return await axios.post(`${Capstone}/auth/login`, { email, pwd });
		} catch (error) {
			console.error("Login error:", error);
			throw error;
		}
	},
	
	// 아이디 중복 체크
	emailCheck: async (inputEmail) => {
		try {
			return await axios.get(`${Capstone}/auth/exist/${inputEmail}`);
		} catch (error) {
			console.error("Error checking email:", error);
			throw error;
		}
	},
	
	// 회원가입
	signup: async (nickname, email, pwd, name, phone, regDate) => {
		const signupData = { nickname, email, pwd, name, phone, regDate };
		try {
			return await axios.post(`${Capstone}/auth/signup`, signupData);
		} catch (error) {
			console.error("Error during signup:", error);
			throw error;
		}
	},
	
	// 회원정보수정 - 기존정보 가져오기
	getMemberInfo: async (userId) => {
		try {
			return await axios.get(`${Capstone}/member/getMemberInfo/${userId}`);
		} catch (error) {
			console.error("Error fetching member info:", error);
			throw error;
		}
	},
	
	// 회원정보수정 - 업데이트
	updateMemberInfo: async (userId, data) => {
		try {
			return await axios.patch(`${Capstone}/member/${userId}`, data);
		} catch (error) {
			console.error("Error updating member info:", error);
			throw error;
		}
	},
	
	// 회원정보수정 - 비밀번호 수정
	updatePassword: async (userId, old_pw, new_pw) => {
		const passwordData = { old_pw, new_pw };
		try {
			return await axios.put(`${Capstone}/member/updatePassword/${userId}`, passwordData);
		} catch (error) {
			console.error("Error updating password:", error);
			throw error;
		}
	},
	
	// SMS 인증번호 보내기
	sendVerificationCode: async (phone) => {
		try {
			return await axios.post(`${Capstone}/auth/sendSms`, { phone });
		} catch (error) {
			console.error("Error sending verification code:", error);
			throw error;
		}
	},
	
	// 휴대폰 인증 코드 확인
	verifyToken: async (email, token) => {
		try {
			const response = await axios.post(`${Capstone}/auth/verifyToken`, { email, token });
			return response.data;
		} catch (error) {
			console.error("Error verifying token:", error);
			throw error;
		}
	},
	
	// 비밀번호 업데이트와 메일 보내기
	sendPw: async (userId, userMail, userPw) => {
		const emailData = { userId, userMail, userPw };
		try {
			return await axios.post(`${Capstone}/auth/sendPw`, emailData);
		} catch (error) {
			console.error("Error sending temporary password:", error);
			throw error;
		}
	},
	
	// 이메일 찾기
	findEmailByPhone: async (phone) => {
		try {
			return await axios.get(`${Capstone}/member/email/${phone}`);
		} catch (error) {
			console.error("Error finding email by phone:", error);
			throw error;
		}
	},
	
	// 이메일 토큰 확인
	verifyEmailToken: async (inputEmail, inputCode) => {
		try {
			const response = await axios.post(`${Capstone}/auth/verify-email-token`, { email: inputEmail, inputToken: inputCode });
			return response.data;
		} catch (error) {
			console.error("Error verifying email token:", error);
			throw error;
		}
	},
	
	// 아이디와 메일 확인
	checkIdMail: async (email) => {
		const checkData = { email };
		try {
			return await axios.post(`${Capstone}/auth/checkIdMail`, checkData);
		} catch (error) {
			console.error("Error checking ID mail:", error);
			throw error;
		}
	},
	
	// 비밀번호 변경
	changePassword: async (newPassword) => {
		try {
			const response = await axios.post(`${Capstone}/auth/change-password`, { pwd: newPassword });
			return response;
		} catch (error) {
			if (error.response) {
				throw new Error(error.response.data);
			} else {
				throw new Error("Server connection failed.");
			}
		}
	},
};

export default AxiosApi;
