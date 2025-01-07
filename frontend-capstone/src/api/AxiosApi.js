import axios from "axios";
const Capstone = "http://localhost:8111";

// return 값을 반환할때 객체를 풀어서 반환하지말고 component 개별적으로 객체를 풀어서 사용할 것
const AxiosApi = {

  getDropDownList: async () => {
    const response = await axios.get(Capstone + `/univ/dropDownList`);
    // console.log(response);
    return response;
   
  },

  getContents: async () => { 
    const response = await axios.get(Capstone + `/univ/contents`);
    // console.log(response)
    return response;
  },
  
  // 채팅방 목록 가져오기
  chatList: async () => {
    return await axios.get(Capstone + `/chat/roomList`);
  },

  // 채팅방 생성하기
  chatCreate: async (email, name) => {
    console.log(email, name);
    const chat = {
      email: email,
      name: name
    };
    return await axios.post(Capstone + "/chat/new", chat);
  },

  // 채팅방 정보 가져오기
  chatDetail: async (roomId) => {
    return await axios.get(Capstone + `/chat/room/${roomId}`);
  }
}

export default AxiosApi