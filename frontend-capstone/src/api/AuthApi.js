import axios from "axios";
import Commons from "../util/Common";


const baseUrl = Commons.Capstone

const AuthApi = {
	// 로그인
	login : (email, password) => {
	const memberReqDto =
		{
			email: email,
			pwd: password
		};
	return axios.post(`${baseUrl}/auth/login`, memberReqDto)
	}
	
}

export default AuthApi