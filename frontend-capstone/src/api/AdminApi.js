import axios from "axios";
import Commons from "../util/Common";

const baseUrl = Commons.Capstone
const token = localStorage.getItem("accessToken");

// 주는거
const AdminApi = {
	getPermissionList: (category) => {
		console.log(`권한 부여 목록 호출 : ${category}`);
		return axios.get(baseUrl + `/admin/permission/list/${category}`, {
			headers: {
				Authorization: `Bearer ${token}`, // ✅ 헤더에 토큰 추가
			},});
	},
	getPermissionDetails: (permissionId) => {
		console.log(`권한 부여 세부 사항 호출 : ${permissionId}`);
		return axios.get(baseUrl + `/admin/permission/details/${permissionId}`, {
			headers: {
				Authorization: `Bearer ${token}`, // ✅ 헤더에 토큰 추가
			},});
	},
	activePermission: (permissionId) => {
		console.log(`권한 부여 : ${permissionId}`);
		return axios.get(baseUrl + `/admin/permission/active/${permissionId}`, {
			headers: {
				Authorization: `Bearer ${token}`, // ✅ 헤더에 토큰 추가
			},});
	},
	
}
export default AdminApi;