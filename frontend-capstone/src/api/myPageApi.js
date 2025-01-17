import axios from "axios";
import Commons from "../util/Common";

const baseUrl = Commons.Capstone

const MyPageApi = {

    // memberGetInfo : async ()=>{
  //   const res = await Commons.getTokenByMemberId();
  //   id = res.data
  //   return await axios.get(`${Capstone}/auth/login/${id}`);
  // },

  // 자소서/생기부 업로드 API
  saveCoverLetterRegister: async (formData) => {
    const res = await Commons.getTokenByMemberId();
    if (!res || !res.data) {
      console.error('memberId가 없습니다.');
      return;
    }
    const memberId = res.data;
    formData.append('memberId', memberId);
    try {
      // 파일 업로드 API 호출
      const response = await axios.post(baseUrl + `/file/save`, formData);
      return response.data; // 응답 데이터 반환
    } catch (error) {
      console.error("파일 업로드 오류:", error);
      throw error;
    }
  },

  // 대학 목록 가져오기 API
  getUnivList: async () => {
    try {
      const response = await axios.get(baseUrl + `/univ/univList`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 학과 목록 가져오기 API (특정 대학에 맞는 학과 목록)
  getDeptList: async (univName) => {
    try {
      const response = await axios.get(baseUrl + `/univ/deptList`, {
        params: { univName },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

};

export default MyPageApi;