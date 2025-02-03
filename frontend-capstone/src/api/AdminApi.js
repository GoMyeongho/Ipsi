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
	activePermission: (permissionId, univId, isUniv) => {
		console.log(`권한 부여 : /admin/permission/active/${permissionId}/${univId}/${isUniv}`);
		return axios.post(baseUrl + `/admin/permission/active/${permissionId}/${univId}/${isUniv}`, {
			headers: {
				Authorization: `Bearer ${token}`, // ✅ 헤더에 토큰 추가
			},});
	},
	getUnivList: () => {
		console.log("대학 목록 불러오기(대학만)");
		return axios.get(baseUrl + `/admin/univ/list`, {
			headers: {
				Authorization: `Bearer ${token}`, // ✅ 헤더에 토큰 추가
			},});
	},
	getDeptList: (univName) => {
		console.log(`${univName}의 학과 조회`);
		return axios.get(baseUrl + `/admin/dept/list/${univName}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},})
	},
	getMemberList: (searchOption, searchValue) => {
		console.log(`${searchOption} 전체 회원 조회 : ${searchValue}`);
		return axios.get(baseUrl + `/admin/member/${searchValue}/${searchOption}`, {
			headers: {
				Authorization: `Bearer ${token}`, // ✅ 헤더에 토큰 추가
			},});
	},
	getMemberDetails: (memberId) => {
		console.log(`${memberId}의 회원 세부 내용 확인`)
		return axios.get(baseUrl + `/admin/member/details/${memberId}`, {
			headers: {
				Authorization: `Bearer ${token}`, // ✅ 헤더에 토큰 추가
			},});
	}
}
export default AdminApi;