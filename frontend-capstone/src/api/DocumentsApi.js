import axios from "axios";
import Commons from "../util/Common";

const baseUrl = Commons.Capstone;

const DocumentsApi = {

  // pages.CoverLetter파일 dropDown List
  getDropDownList: async () => {
    const response = await axios.get(baseUrl + `/univ/dropDownList`);
    return response;
  },

  // pages.CoverLetter파일 contents item List (페이지네이션 적용)
  getPSContents: async (
    page = 1,
    limit = 18,
    univName = "",
    univDept = "",
    fileCategory = "ps",
  ) => {
    try {
      // 로그인 상태 확인
      const isLoggedIn = Commons.isLoggedIn(); // 로그인 여부 확인
      let memberId = 0; // 기본값은 0으로 설정

      // 로그인한 경우에만 memberId를 가져옵니다
      if (isLoggedIn) {
        const res = await Commons.getTokenByMemberId();
        if (res && res.data) {
          memberId = res.data; // memberId를 백엔드에서 가져옴
        } else {
          console.error("로그인 상태이지만 memberId를 가져오지 못했습니다.");
          return null;
        }
      }
  
      // API 요청에 필요한 파라미터 설정
      const response = await axios.get(baseUrl + `/file/psList`, {
        params: {
          page, // 현재 페이지 번호
          limit, // 페이지당 항목 수
          univName, // 대학명 (선택 시 필터)
          univDept, // 학과명 (선택 시 필터)
          fileCategory, // 파일 카테고리 (sr 또는 ps)
          memberId, // memberId 추가
        },
      });
      console.log(response);
  
      // 페이지 수와 항목 목록을 하나의 객체로 반환
      return {
        content: response.data.content, // 항목 목록
        totalPages: response.data.totalPages, // 전체 페이지 수
        purchasedFileIds: response.data.purchasedFileIds
      };
    } catch (error) {
      console.error("내용 목록을 가져오는 중 오류 발생:", error);
      throw error;
    }
  },
  
  // pages.CoverLetter파일 contents item List (페이지네이션 적용)
  getSRContents: async (
    page = 1,
    limit = 18,
    univName = "",
    univDept = "",
    fileCategory = "ps",
  ) => {
    try {
      // 로그인 상태 확인
      const isLoggedIn = Commons.isLoggedIn(); // 로그인 여부 확인
      let memberId = 0; // 기본값은 0으로 설정

      // 로그인한 경우에만 memberId를 가져옵니다
      if (isLoggedIn) {
        const res = await Commons.getTokenByMemberId();
        if (res && res.data) {
          memberId = res.data; // memberId를 백엔드에서 가져옴
        } else {
          console.error("로그인 상태이지만 memberId를 가져오지 못했습니다.");
          return null;
        }
      }
  
      // API 요청에 필요한 파라미터 설정
      const response = await axios.get(baseUrl + `/file/srList`, {
        params: {
          page, // 현재 페이지 번호
          limit, // 페이지당 항목 수
          univName, // 대학명 (선택 시 필터)
          univDept, // 학과명 (선택 시 필터)
          fileCategory, // 파일 카테고리 (sr 또는 ps)
          memberId, // memberId 추가
        },
      });
      console.log(response);
  
      // 페이지 수와 항목 목록을 하나의 객체로 반환
      return {
        content: response.data.content, // 항목 목록
        totalPages: response.data.totalPages, // 전체 페이지 수
        purchasedFileIds: response.data.purchasedFileIds
      };
    } catch (error) {
      console.error("내용 목록을 가져오는 중 오류 발생:", error);
      throw error;
    }
  },

  getPaySave: async (formData) => {
    const res = await Commons.getTokenByMemberId();
    if (!res || !res.data) {
      console.error("memberId가 없습니다.");
      return;
    }
    const memberId = res.data;
    formData.append("memberId", memberId);
    try {
      // 파일 업로드 API 호출
      const response = await axios.post(baseUrl + `/pay/save`, formData);
      console.log(response);
      return response; // 응답 데이터 반환
    } catch (error) {
      console.error("파일 업로드 오류:", error);
      throw error;
    }
  },

  download: async (params) => {
    try {
      const response = await axios.get(baseUrl + `/file/download`, {
        params, // 쿼리 파라미터로 fileUrl 및 fileName 전달
        responseType: "blob", // 파일 데이터 수신
      });
  
      console.log("Response Headers:", response.headers); // 응답 헤더 로그 추가
      return response;
    } catch (error) {
      console.error("파일 다운로드 오류:", error);
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

  // 결제 완료 처리 함수 (orderId로 결제 완료 처리)
  completePayment: async (orderId) => {
    try {
      // orderId를 이용해 백엔드 API 호출
      const response = await axios.post( baseUrl + `/pay/complete/${orderId}`);
      return response;
    } catch (error) {
      console.error("결제 완료 처리 중 오류 발생:", error);
      throw error;
    }
  },
};

export default DocumentsApi;
