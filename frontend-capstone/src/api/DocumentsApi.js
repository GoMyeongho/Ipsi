import axios from "axios";
import Commons from "../util/Common";

const baseUrl = Commons.Capstone

const DocumentsApi = {
    // pages.CoverLetter파일 dropDown List
    getDropDownList: async () => {
      const response = await axios.get(baseUrl + `/univ/dropDownList`);
      // console.log(response);
      return response;
    },
    // pages.CoverLetter파일 contents item List (페이지네이션 적용)
    getContents: async (page = 1, limit = 18, univName = '', univDept = '') => {
      try {
        // 대학 목록 및 페이지 수를 함께 받도록 요청
        const response = await axios.get(baseUrl + `/file/list`, {
          params: {
            page, // 현재 페이지 번호
            limit, // 페이지당 항목 수
            univName, // 대학명 (선택 시 필터)
            univDept, // 학과명 (선택 시 필터)
          },
        });
          console.log(response);
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
          baseUrl + `/api/v1/payments/confirm`,
          data
        );
        return response;
      } catch (error) {
        console.error("결제 승인 API 호출 중 오류 발생:", error);
        throw error;
      }
    },
};

export default DocumentsApi;