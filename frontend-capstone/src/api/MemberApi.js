import axios from "axios";
import Commons from "../util/Common";
import AxiosInstance from "./AxiosInstance";

const baseUrl = Commons.Capstone

const MemberApi = {
	// admin 인지 확인 하는 api
	isAdmin: async () => {
		const token = localStorage.getItem("accessToken");
		console.log("ADMIN 계정 인지 확인중 : ", token)
		if (!token) {
			console.error("토큰이 없습니다. 로그인 후 시도하세요.");
			return { isAdmin: false }; // ✅ 토큰 없을 경우 기본값 반환
		}
		return await axios.get(baseUrl + `/member/isRole/ROLE_ADMIN`, {
			headers: {
				Authorization: `Bearer ${token}`, // ✅ 헤더에 토큰 추가
			},
		});
	},
}

export default MemberApi