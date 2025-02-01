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

  getMyChatRoom: async (memberId) => {
    try {
      const response = await axios.get(Capstone + `/chat/myRooms/${memberId}`);
      // 성공 시 데이터 반환
      return response.data;
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      throw new Error("Failed to fetch chat rooms.");
    }
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
    try {
      const response = await axios.get(Capstone + `/chat/room/${roomId}`);
      console.log(response.data);
      console.log(response.data.name);
      console.log("입장 가능 인원 : {}", response.data.personCnt);
      return response.data;
    } catch (error) {
      console.error("Error fetching chat room details:", error);
      throw error;
    }
  },

  // 해당 채팅방의 이전 채팅 내역 가져오기
  chatHistory: async (roomId) => {
    return await axios.get(Capstone + `/chat/message/${roomId}`)
  },

  // 토큰에서 닉네임 가져오기
  getNickName: async () => {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(Capstone + `/member/nickName`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ 헤더에 토큰 추가
        },
    });
    return response;
  },

  // 채팅방 참여 인원 확인
  cntRoomMember: async (roomId) => {
    try {
      const response = await axios.get(Capstone + `/chat/cntRoomMember/${roomId}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      throw new Error("Failed to fetch chat rooms.");
    }
  },

  delRoom: async (roomId) => {
    return await axios.delete(Capstone + `/chat/delRoom/${roomId}`)
  },
}

export default ChattingApi;
