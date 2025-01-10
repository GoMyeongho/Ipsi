import axios from "axios";
import Commons from "../util/Common";

const baseUrl = Commons.Capstone

const AdminApi = {
	getPermissionList: (category) => {
		console.log(`권한 부여 목록 호출 : ${category}`);
		return axios.get(baseUrl + `admin/permission/list/${category}`);
	},
	getPermissionDetails: (permissionId) => {
		console.log(`권한 부여 세부 사항 호출 : ${permissionId}`);
		return axios.get(baseUrl + `admin/permission/details/${permissionId}`);
	},
	activePermission: (permissionId) => {
		console.log(`권한 부여 : ${permissionId}`);
		return axios.get(baseUrl + `admin/permission/active/${permissionId}`);
	},
	
}
export default AdminApi;