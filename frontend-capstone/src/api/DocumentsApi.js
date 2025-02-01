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
    keywords = "",
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
          keywords,
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
    keywords = "",
    fileCategory = "sr",
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
          keywords,
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

// Detail화면 댓글 목록 가져오기 (페이지네이션 추가)
getReview: async (fileBoardId, page = 0, size = 5) => {
  try {
    // 댓글을 가져오기 위한 GET 요청
    const response = await axios.get(baseUrl + `/review/readReview`, {
      params: {
        fileBoardId, // 아이템의 fileBoardId를 쿼리 파라미터로 전송
        page,         // 페이지 번호 추가
        size,         // 페이지 크기 추가
      },
    });

    // 응답 데이터 반환 (댓글 목록 등)
    return response; // 예: { content: [...], totalPages: 3, currentPage: 0 }

  } catch (error) {
    console.error("댓글을 가져오는 중 오류 발생:", error);
    throw error; // 오류를 throw하여 상위 컴포넌트에서 처리하도록 함
  }
},

  // Detail화면 댓글 등록
  postReview: async (reviewData) => {
    const res = await Commons.getTokenByMemberId();
    if (!res || !res.data) {
      console.error('memberId가 없습니다.');
      return;
    }
    const memberId = res.data;
    
    // reviewData에 memberId를 추가
    const reviewWithMemberIdData= { ...reviewData, memberId: memberId };
    console.log(reviewWithMemberIdData);
    try {
      const response = await axios.post(baseUrl + `/review/inputReview`, reviewWithMemberIdData);
      return response;
    } catch (error) {
      console.error("댓글 저장 중 오류 발생:", error);
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
