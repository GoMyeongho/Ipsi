import axios from "axios";
const Capstone = "http://localhost:8111";

// return 값을 반환할때 객체를 풀어서 반환하지말고 component 개별적으로 객체를 풀어서 사용할 것
const ChattingApi = {
 
  // 채팅방 목록 가져오기
  chatList: async () => {
    return await axios.get(Capstone + "/chat/roomList");
  },
  getRooms : async () => {
    return await axios.get(Capstone + "/chat/rooms")
  },

  // 채팅방 생성하기
  chatCreate: async (name, personCnt) => {
    const chat = {
      name: name,
      personCnt: personCnt
    };
    console.log(chat); // 서버로 보낼 데이터를 확인
    return await axios.post(Capstone + "/chat/new", chat);
  },

  // 채팅방 정보 가져오기
  chatDetail: async (roomId) => {
    // return await axios.get(Capstone + `/chat/room/${roomId}`, roomId);
    try {
      const response = await axios.get(Capstone + `/chat/room/${roomId}`);
      console.log(response.data); // 잘 찍힘
      console.log(response.data.name);  // 잘 찍힘
      return response.data;
    } catch (error) {
      console.error("Error fetching chat room details:", error);
      throw error;
    }
  },

/*   // 해당 채팅방의 이전 채팅 내역 가져오기
  chatHistory: async (roomId) => {
    const response = await axios.get(Capstone + `/chat/message/${roomId}`);
    if (response.data && Array.isArray(response.data.messages)) {
      return response.data.messages;  // 메시지 목록을 반환
    }
    return response.data;
  }, */

  // 해당 채팅방의 이전 채팅 내역 가져오기
  chatHistory: async (roomId) => {
/*     const response = await axios.get(Capstone + `/chat/message/${roomId}`);
    if (response.data && Array.isArray(response.data.messages)) {
      return response.data.messages;  // 메시지 목록을 반환
    }
    return response.data; */
    return await axios.get(Capstone + `/chat/message/${roomId}`)
  },

  getNickName: async () => {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(Capstone + `/member/nickName`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ 헤더에 토큰 추가
        },
    });
    return response;
  },
}

export default ChattingApi;
