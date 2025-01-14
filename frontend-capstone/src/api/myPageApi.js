import axios from "axios";
import Commons from "../util/Common";

const baseUrl = Commons.Capstone

const MyPageApi = {

  saveCoverLetterRegister: async (formData) => {
    try {
      const response = await axios.post(baseUrl + `/file/save`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response)
      return response;
    } catch (error) {
      throw error;
    }
  },
};
export default MyPageApi;