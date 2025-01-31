import axios from "axios";
import Commons from "../util/Common";
const Capstone = "http://localhost:8111";
axios.defaults.withCredentials = true; // 쿠키를 요청에 포함
const AuthApi = {

	sendPw: async (email) => {
		return await axios.post(`${Capstone}/auth/sendPw`, { email: email }); // email을 객체로 감싸서 전달
	  },

	  // 로그인
	login: async (email, pwd) => {
		console.log("로그인 진입 : " + email);
		const data = {
			email: email,
			pwd: pwd,
		};
		return await axios.post(Capstone + "/auth/login", data);
	},

	// 아이디 중복 체크
	emailCheck: async (inputEmail) => {
		return await axios.get(`${Capstone}/auth/exist/${inputEmail}`);
	},
	// 닉네임 중복 체크
	nickNameCheck: async (nickName) => {
		return await axios.get(`${Capstone}/auth/nickname/${nickName}`);
	},
	
	// 휴대폰 중복 체크
	phoneCheck: async (phone) => {
		return await axios.get(`${Capstone}/auth/phone/${phone}`);
	},

	// 회원가입
	signup: async (email, pwd, name, phone, regDate) => {
		const signupData = {
			// nickname: nickname,
			email: email,
			pwd: pwd,
			name: name,
			phone: phone,
			regDat: regDate
			
		};
		return await axios.post(`${Capstone}/auth/signup`, signupData);
	},
	verifySmsToken: async (inputPhone, inputToken) => {
		try {
			const response = await axios.post(`${Capstone}/auth/verify-sms-token`, {
				phone: inputPhone,
				inputToken: inputToken,
			});
			return response.data; // 서버 응답 데이터 반환
		} catch (error) {
			console.error("인증번호 검증 실패", error);
			throw error;
		}
	},
	// findPhoneByEmail: async (phone) => {
	// 	return await axios.post(`${Capstone}/member/findEmailByPhone`, {
	// 		phone,
	// 	});
	// },
	findPhoneByEmail: async (phone) => {
		return await axios.get(`${Capstone}/auth/email/${phone}`);
	  },
	  sendVerificationCode: async (phone) => {
		console.log("휴대전화 번호 인증")
		return await axios.post(`${Capstone}/auth/sendSms`, {
			phone: phone,
		})
	},


	findEmailByPhone: async (phone) => {
		return await axios.get(`${Capstone}/member/email/${phone}`);
	  },
	
	
	// 휴대폰 인증 코드 확인
	verifyEmialToken: async (inputEmail, inputCode) => {
		try {
			const response = await axios.post(`${Capstone}/auth/verify-email-token`, {
				email: inputEmail,
				inputToken: inputCode,
			});
			return response.data; // "토큰이 유효합니다." 또는 "유효하지 않거나 만료된 토큰입니다."
		} catch (error) {
			console.error("토큰 검증 실패:", error.response.data);
			throw new Error(error.response.data);
		}
	},
	
	checkIdMail: async (email) => {	
		const checkData = {
			email: email,
		};
		try {
			return await axios.post(
				`${Capstone}/auth/checkIdMail`,
				checkData
			);
		} catch (error) {
			console.error("checkIdMail error:", error);
			throw error;
		}
	},

	
	changePassword: async (newPassword) => {
		

		try {
			const response = await axios.post(`${Capstone}/auth/change-password`, {
				pwd: newPassword  // 본문(body)에 `pwd` 필드로 데이터 전송
			});
			return response // 비밀번호 변경 성공 메시지
		} catch (error) {
			if (error.response) {
				// 서버에서 반환한 오류 메시지
				throw new Error(error.response.data);
			} else {
				throw new Error('서버에 연결할 수 없습니다.');
			}
		}
	},

	getMemberInfoByToken: async () => {
        try {
          // 1. getTokenByMemberId 호출하여 멤버 ID 가져오기
          const memberIdResponse = await Commons.getTokenByMemberId();
      
          const memberId = memberIdResponse.data.memberId;
      
          // 2. 멤버 ID로 회원 정보 가져오기
          const memberInfoResponse = await axios.get(`${Capstone}/member/${memberId}`);
          
          // 3. univ 값이 null이 아니면 univ 정보를 가져와서 추가
          if (memberInfoResponse.data.univ) {
            const univResponse = await axios.get(`${Capstone}/univ/${memberInfoResponse.data.univ}`);
            const univData = univResponse.data;
            
            // 대학 정보 추가
            memberInfoResponse.data.univName = univData.univName;
            memberInfoResponse.data.univDept = univData.univDept;
          } else {
            // univ가 null이면 기본값 설정
            memberInfoResponse.data.univName = "";
            memberInfoResponse.data.univDept = "";
            
          }
      
          return memberInfoResponse.data;  // 회원 정보 반환
        } catch (error) {
          console.error("회원 정보 조회 중 오류:", error);
          throw error; // 에러 다시 던짐
        }
      },
	IsLogin: async () => {
		const accessToken = Commons.getAccessToken();
		if(!accessToken) return null;
		return await axios.get( Commons.Capstone + `/member/role`, {
			headers: {
				Authorization: `Bearer ${accessToken}`, // ✅ 헤더에 토큰 추가
			},});
		},
}



export default AuthApi