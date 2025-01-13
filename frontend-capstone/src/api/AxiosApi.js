import axios from "axios";
const Capstone = "http://localhost:8111";

// return 값을 반환할때 객체를 풀어서 반환하지말고 component 개별적으로 객체를 풀어서 사용할 것
const AxiosApi = {
  // pages.CoverLetter파일 dropDown List
  getDropDownList: async () => {
    const response = await axios.get(Capstone + `/univ/dropDownList`);
    // console.log(response);
    return response;
  },
  // pages.CoverLetter파일 contents item List (페이지네이션 적용)
  getContents: async (page = 1, limit = 18, univName = '', univDept = '') => {
    try {
      // 대학 목록 및 페이지 수를 함께 받도록 요청
      const response = await axios.get(Capstone + `/univ/contents`, {
        params: {
          page, // 현재 페이지 번호
          limit, // 페이지당 항목 수
          univName, // 대학명 (선택 시 필터)
          univDept, // 학과명 (선택 시 필터)
        },
      });

      // 페이지 수와 항목 목록을 하나의 객체로 반환
      return {
        content: response.data.content, // 항목 목록
        totalPages: response.data.totalPages, // 전체 페이지 수
      };
    } catch (error) {
      console.error("내용 목록을 가져오는 중 오류 발생:", error);
      throw error;
    }
  },

  // Confirm payment API 호출
  confirmPayment: async (data) => {
    try {
      // data는 이미 객체 형태로 전달받음
      const response = await axios.post(
        Capstone + `/api/v1/payments/confirm`,
        data
      );
      return response;
    } catch (error) {
      console.error("결제 승인 API 호출 중 오류 발생:", error);
      throw error;
    }
  },
  
  // 채팅방 목록 가져오기
  chatList: async () => {
    return await axios.get(Capstone + `/chat/roomList`);
  },

  // 채팅방 생성하기
  chatCreate: async (name, personCnt) => {
    console.log(name);
    const chat = {
      name: name,
      personCnt: personCnt
    };
    console.log(chat); // 서버로 보낼 데이터를 확인
    return await axios.post(Capstone + "/chat/new", chat);
  },

  // 채팅방 정보 가져오기
  chatDetail: async (roomId) => {
    return await axios.get(Capstone + `/chat/room/${roomId}`);
  },

  // 해당 채팅방의 이전 채팅 내역 가져오기
  chatHistory: async (roomId) => {
    const response = await axios.get(Capstone + `/chat/message/${roomId}`);
    if (response.data && Array.isArray(response.data.messages)) {
      return response.data.messages;  // 메시지 목록을 반환
    }
    return response.data;  // 객체로 온다면, 필요에 따라 처리
  },
}

export default AxiosApi;
