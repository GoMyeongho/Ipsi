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

  // pages.CoverLetter파일 contents item List
  getContents: async () => {
    const response = await axios.get(Capstone + `/univ/contents`);
    // console.log(response)
    return response;
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
};

export default AxiosApi;
