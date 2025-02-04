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
      console.log(response)
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

  // 내가 구매한 자소서 가져오기
  PurchasedEnumPSItem: async (fileCategory) => {  // category를 인자로 추가
    const res = await Commons.getTokenByMemberId();
    if (!res || !res.data) {
      console.error('memberId가 없습니다.');
      return;
    }
    const memberId = res.data;
    
    try {
      const response = await axios.get(baseUrl + `/pay/purchasedEnumPS`, {
        params: {
          memberId: memberId,
          fileCategory: fileCategory,  // category도 파라미터로 전달
          status: "COMPLETED"
        }
      });
      console.log('API 응답:', response);  // 응답 데이터 로깅
      return response;
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error);
      throw error;
    }
  },

  // 내가 구매한 생기부 가져오기
  PurchasedEnumSRItem: async (fileCategory) => {  // category를 인자로 추가
    const res = await Commons.getTokenByMemberId();
    if (!res || !res.data) {
      console.error('memberId가 없습니다.');
      return;
    }
    const memberId = res.data;
    
    try {
      const response = await axios.get(baseUrl + `/pay/purchasedEnumSR`, {
        params: {
          memberId: memberId,
          fileCategory: fileCategory,  // category도 파라미터로 전달
          status: "COMPLETED"
        }
      });
      console.log('API 응답:', response);  // 응답 데이터 로깅
      return response;
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error);
      throw error;
    }
  },
  
  // 내가 업로드한 자소서 가져오기
  UploadedEnumPSItem: async (fileCategory) => {  // category를 인자로 추가
    const res = await Commons.getTokenByMemberId();
    if (!res || !res.data) {
      console.error('memberId가 없습니다.');
      return;
    }
    const memberId = res.data;
    
    try {
      const response = await axios.get(baseUrl + `/file/uploadedEnumPS`, {
        params: {
          memberId: memberId,
          fileCategory: fileCategory  // category도 파라미터로 전달
        }
      });
      console.log('API 응답:', response);  // 응답 데이터 로깅
      return response;
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error);
      throw error;
    }
  },

  // 내가 업로드한 생기부 가져오기
  UploadedEnumSRItem: async (fileCategory) => {  // category를 인자로 추가
    const res = await Commons.getTokenByMemberId();
    if (!res || !res.data) {
      console.error('memberId가 없습니다.');
      return;
    }
    const memberId = res.data;
    
    try {
      const response = await axios.get(baseUrl + `/file/uploadedEnumSR`, {
        params: {
          memberId: memberId,
          fileCategory: fileCategory  // category도 파라미터로 전달
        }
      });
      console.log('API 응답:', response);  // 응답 데이터 로깅
      return response;
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error);
      throw error;
    }
  },
};
export default MyPageApi;