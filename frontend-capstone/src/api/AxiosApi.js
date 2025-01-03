import axios from "axios";
const Capstone = "http://localhost:8111";

// return 값을 반환할때 객체를 풀어서 반환하지말고 component 개별적으로 객체를 풀어서 사용할 것
const AxiosApi = {

  getContents: async () => {
    
    const response = await axios.get(Capstone + `/univ/allSearch`);
    // console.log(response)
    return response;
  }
  

}

export default AxiosApi