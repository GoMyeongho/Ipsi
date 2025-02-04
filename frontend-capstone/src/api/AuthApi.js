import axios from "axios";
import Commons from "../util/Common";


const Capstone = "http://localhost:8111";
axios.defaults.withCredentials = true; // 쿠키를 요청에 포함
const AuthApi = {


	// checkLoginStatus: async () => {
	// 	const accessToken = Commons.getAccessToken();
	  
	// 	if (!accessToken) {
	// 	  // 토큰이 없으면 로그인 페이지로 이동
	// 	  alert("로그인 해주세요");
	// 	  window.location.href = "/";
	// 	  return false; // 로그인 상태가 아님
	// 	}
	  
	// 	try {
	// 	  const res = await axios.get(`${Capstone}/member/isLogin/${accessToken}`, {
	// 		headers: {
	// 		  "Content-Type": "application/json",
	// 		  Authorization: `Bearer ${accessToken}`,
	// 		},
	// 	  });
	  
	// 	  if (res.data === true) {
	// 		console.log("로그인 상태 확인 완료");
	// 		return true; // 로그인 상태
	// 	  } else {
	// 		alert("로그인 필요");
	// 		window.location.href = "/";
	// 		return false; // 로그인 상태 아님
	// 	  }
	// 	} catch (e) {
	// 	  console.log(e);
	// 	  if (e.response && e.response.status === 401) {
	// 		// 401 오류 발생 시 토큰 만료 처리
	// 		console.log("로그인 만료, 토큰 재발급 시도 중...");
	// 		try {
	// 		  const res = await Commons.handleUnauthorized();
	// 		  if (res === false) {
	// 			alert("로그인 해주세요");
	// 			window.location.href = "/";
	// 			return false; // 로그인 상태 아님
	// 		  }
	// 		  const newToken = Commons.getAccessToken();
	// 		  if (newToken !== accessToken) {
	// 			const token = await AuthApi.checkLoginStatus(); // 재확인
	// 			if (token) {
	// 			  console.log("로그인 상태 확인 완료");
	// 			}
	// 		  }
	// 		} catch (e) {
	// 		  console.log(e);
	// 		  alert("세션이 만료되었습니다. 다시 로그인해주세요.");
	// 		  window.location.href = "/";
	// 		  return false;
	// 		}
	// 	  } else {
	// 		// 다른 오류 처리
	// 		console.log("예기치 않은 오류 발생");
	// 		window.location.href = "/";
	// 		return false; // 예기치 않은 오류
	// 	  }
	// 	}
	//   },

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
	signup: async (nickname,email, pwd, name, phone, regDate) => {
		const signupData = {
			nickname: nickname,
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

	nickNameCheck : async (nickname) =>{
		try{
		return await axios.get(`${Capstone}/auth/nickname/${nickname}`);
		}catch(error){
			console.error("중복체크 실패")
		}
	},
	changeNickName: async (inputNickName) => {
		try {
			const token = localStorage.getItem("accessToken"); // 토큰 가져오기
			return await axios.post(
				`${Capstone}/member/changeNickName`,
				{
					
					nickname: inputNickName
				},
				{
					headers: {
						Authorization: `Bearer ${token}` // 헤더에 토큰 추가
					}
				}
			);
		} catch (error) {
			console.log("수정 중 오류 발생", error);
		}
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
	getMemberDetails : async () => {
		try {
		  // 로컬스토리지에서 토큰 가져오기
		  const token = localStorage.getItem("accessToken");
		  if (!token) {
			throw new Error("토큰이 존재하지 않습니다.");
		  }
		  // 회원 정보 요청
		  const response = await axios.get(`${Capstone}/member/details`, {
			headers: {
			  Authorization: `Bearer ${token}`, // Bearer 형식으로 토큰 적용
			},
		  });
	  
		  const memberData = response.data;
		  return memberData
		
		} catch (error) {
		  console.error("회원 정보 요청 실패:", error.message || error);
		}
	  },

	  fetchUserData: async (token) => {
		try {
		  const response = await axios.get(`${Capstone}/member/permission`, {
			headers: { Authorization: `Bearer ${token}` },
		  });
		  return response.data;
		} catch (error) {
		  console.error("사용자 데이터 가져오기 실패:", error);
		  throw error;
		}
	},
	
	 getRevenue: async (token) => {
		try {
		  const response = await axios.get(`${Capstone}/member/revenue`, {
			headers: { Authorization: `Bearer ${token}` },
		  });
		  return response.data; // 실제 데이터 반환
		} catch (error) {
		  console.error("수익금 가져오기 실패", error);
		  throw error; // 에러를 다시 던져 상위에서 처리할 수 있도록 함
		}
	  },
	   saveRevenue :async (profit, token) => {
		try {
		  const response = await axios.get(
			`${Capstone}/member/saveRevenue`,
			{
			  params: { profit },  // 쿼리 파라미터로 profit 포함
			  headers: { Authorization: `Bearer ${token}` },  // Authorization 헤더에 토큰 포함
			}
		  );
		  return response;
		} catch (error) {
		  console.error("사용자 데이터 가져오기 실패:", error);
		  throw error;
		}
	  },
	  
	  
	  changeBankInfo : async (memberId,bankName,bankAccount) => {
		try {
			const response = await axios.post(`${Capstone}/auth/changeBankInfo`,{
				memberId : memberId,
				bankName : bankName,
				bankAccount : bankAccount
			});
			return response.data;
		}catch(error) {
			console.log(error)
		}
	  },
	  

	

		IsLogin : async()=>{
			const accessToken = Commons.getAccessToken();
			return await axios.get(Capstone+`/member/isLogin/${accessToken}`,{
			  headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + accessToken,
			  },
			})
		  },

		  savePermission: async (permissionUrl) => {
			try {
			  const token = localStorage.getItem("accessToken");
			  return await axios.post (`${Capstone}/auth/savePermission`,
				{
					permissionUrl :permissionUrl
				},	
				{
					headers: {
						Authorization: `Bearer ${token}` // 헤더에 토큰 추가
					}
				}
			  )
			} catch (error) {
			  console.error("파일 업로드 오류:", error);
			}
		  },


		getBankList: async () => {
			try {
			  const response = await axios.get(`${Capstone}/auth/banklist`); // 은행 목록 API 호출
			  return response.data; // 은행 목록 반환
			} catch (error) {
			  console.error("은행 목록을 가져오는 데 실패했습니다:", error.message);
			  throw error; // 에러를 호출한 쪽에서 처리할 수 있도록 던짐
			}
		  },

		  checkCurrentPassword: async (currentPassword) => {
			console.log(currentPassword)
			try {
				const token = localStorage.getItem("accessToken");
				const response = await axios.post(`${Capstone}/member/check-password`, {
					pwd: currentPassword
				},{
					headers: {
						Authorization: `Bearer ${token}` // 헤더에 토큰 추가
					}
				}
			);
				console.log(response.data)
				
				// 서버 응답에서 성공 여부만 반환
				return response.data; // response.data가 true/false인 경우 이를 그대로 반환
		
			} catch (error) {
				console.error("에러 발생", error);
				throw error; // 에러가 발생하면 다시 throw하여 상위에서 처리
			}

}


}


export default AuthApi