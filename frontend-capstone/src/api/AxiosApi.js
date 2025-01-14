import axios from "axios";
const Capstone = "http://localhost:8111";

// return 값을 반환할때 객체를 풀어서 반환하지말고 component 개별적으로 객체를 풀어서 사용할 것
const AxiosApi = {
  getDropDownList: async () => {
    const response = await axios.get(Capstone + `/univ/dropDownList`);
    return response;
  },

  getContents: async () => { 
    const response = await axios.get(Capstone + `/univ/contents`);
    return response;
  },

  // 채팅방 목록 가져오기
  chatList: async () => {
    return await axios.get(Capstone + `/chat/roomList`);
  },

  // 채팅방 생성하기
  chatCreate: async (email, name) => {
    const chat = { email: email, name: name };
    return await axios.post(Capstone + "/chat/new", chat);
  },

  // 채팅방 정보 가져오기
  chatDetail: async (roomId) => {
    return await axios.get(Capstone + `/chat/room/${roomId}`);
  },

  // 로그인
  login: async (email, pwd) => {
    console.log("로그인 진입 : " + email);
    const data = {
      email: email,
      pwd: pwd,
    };
    return await axios.post(Capstone+ "/auth/login", data);
  },
  // 아이디 중복 체크
  idCheck: async (email) => {
    return await axios.get(`${Capstone}/auth/exist/${email}`);
  },
  // 닉네임 중복 체크
  nickNameCheck : async (nickName) => {
    return await axios.get(`${Capstone}/auth/nickname/${nickName}`);
  },

  // 휴대폰 중복 체크 
  phoneCheck : async (phone) =>{
    return await axios.get(`${Capstone}/auth/phone/${phone}`);
  },



  // 회원가입
  signup: async ( nickname,email,pwd,name, phone, regDate) => {
    const signupData = {
      nickname: nickname,
      email : email,
      pwd: pwd,
      name: name,
      phone: phone,
      regDat: regDate
    
    };
    return await axios.post(`${Capstone}/auth/signup`, signupData);
  },

  // 회원정보수정 - 기존정보 가져오기
  getMemberInfo: async (userId) => {
    return await axios.get(`${Capstone}/member/getMemberInfo/${userId}`);
  },

  // 회원정보수정 - 업데이트
  updateMemberInfo: async (userId, data) => {
    return await axios.patch(`${Capstone}/member/${userId}`, data);
  },

  // 회원정보수정 - 비밀번호 수정
  updatePassword: async (userId, old_pw, new_pw) => {
    const passwordData = { old_pw: old_pw, new_pw: new_pw };
    return await axios.put(
      `${Capstone}/member/updatePassword/${userId}`,
      passwordData
    );
  },
  verifySmsToken  : async (inputPhone, inputToken) => {
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
  findIdByEmail: async (email) => {
    return await axios.post(`${Capstone}/auth/findIdByEmail`, {
      email,
    });
  },
  
   // 회원정보수정 - 비밀번호수정
   updatePassword: async (userId, old_pw, new_pw) => {
    const passwordData = {
      old_pw: old_pw,
      new_pw: new_pw,
    };
    return await axios.put(
      `${Capstone}/member/updatePassword/${userId}`,
      passwordData
    );
  },
  // 휴대폰 인증 코드 보내기 

  sendVerificationCode: async (phone) => {
    console.log("휴대전화 번호 인증")
    return await axios.post(`${Capstone}/auth/sendSms`, {
        phone: phone,
    })
  },
  
  


  // 휴대폰 인증 코드 확인 
  verifyToken: async (email, token) => {
    try {
      const response = await axios.post(`${Capstone}/auth/verifyToken`, {
        email: email,
        token: token,
      });
      return response.data; // "토큰이 유효합니다." 또는 "유효하지 않거나 만료된 토큰입니다."
    } catch (error) {
      console.error("토큰 검증 실패:", error.response.data);
      throw new Error(error.response.data);
    }
  },
  

  


  checkIdMail: async (userId, userMail) => {
    const checkData = {
      userId: userId,
      userMail: userMail,
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

  // 비밀번호 업데이트와 메일보내기
  sendPw: async (userId, userMail, userPw) => {
    const emailData = {
      userId: userId,
      userMail: userMail,
      userPw: userPw,
    };
    try {
      return await axios.post(`${Capstone}/auth/sendPw`, emailData);
    } catch (error) {
      console.error("sendTemporaryPassword error:", error);
      throw error;
    }
  }

};

export default AxiosApi;
