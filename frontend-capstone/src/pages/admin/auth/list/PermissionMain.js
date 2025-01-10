import { useContext, useEffect } from "react";
import { PermissionContext } from "../../../../context/admin/PermissionStore";
import AdminApi from "../../../../api/AdminApi";
import { BackGround } from "../../../../styles/GlobalStyle";
import PermissionCategorySelector from "../list/PermissonCategorySelector";
import SortTable from "../../../../component/SortTable";
import styled from "styled-components";

// 스타일링 적용
const MainContainer = styled.div`
  padding: 20px;
	margin: 50px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: #f9f9f9; /* 배경색 추가 */
  border-radius: 10px; /* 모서리 둥글게 */
`;

const Title = styled.h1`
  font-size: 24px;
  color: #6154d4;
  margin-bottom: 20px;
  font-weight: bold;
`;

const PermissionMain = () => {
	const {setPage, permissionCategory, permissionList, setPermissionList } = useContext(PermissionContext);
	
	const sortList = [
		{ name: "요청자", id: "nickName", align: "left", isSort: false, link: (item) => `/admin/member/${item.memberId}` },
		{ name: "대학교", id: "univName", align: "right", isSort: true, link: (item) => `/admin/auth/${item.permissionId}` },
		{ name: "학과", id: "univDept", align: "right", isSort: true, link: (item) => `/admin/auth/${item.permissionId}` },
		{ name: "요청 일자", id: "regDate", align: "right", isSort: true, link: (item) => `/admin/auth/${item.permissionId}` },
	];
	
	useEffect(() => {
		setPage("auth");
	}, []);
	
	
	useEffect(() => {
		const permissions = async () => {
			try {
				const rsp = await AdminApi.getPermissionList(permissionCategory);
				console.log(rsp);
				setPermissionList(rsp.data);
			} catch (error) {
				console.log("권한 목록 조회중 에러 : " + error);
			}
		};
		permissions();
	}, [permissionCategory]);
	
	return (
		<BackGround>
			<MainContainer>
				<Title>권한 관리</Title>
				<PermissionCategorySelector />
				<SortTable list={permissionList} sortList={sortList} />
			</MainContainer>
		</BackGround>
	);
};

export default PermissionMain;
