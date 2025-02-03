import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdminApi from "../../../../api/AdminApi";
import { PermissionContext } from "../../../../context/admin/PermissionStore";
import { BackGround } from "../../../../styles/GlobalStyle";
import { useParams } from "react-router-dom";
import { Box, IconButton, Tooltip } from "@mui/material";
import styled from "styled-components";
import ControlListComponent from "./ControlListComponent";
import ControlListHeader from "./ControlListHeader";

const MemberControlMain = () => {
	const role = useSelector(state => state.persistent.role);
	const { setPage } = useContext(PermissionContext);
	const [memberList, setMemberList] = useState([]);
	const { searchOption, searchValue } = useParams();
	
	console.log(searchOption, searchValue);
	
	useEffect(() => {
		setPage("member");
	}, []);
	
	useEffect(() => {
		// 멤버 리스트를 가져오는 함수
		const fetchMembers = async () => {
			try {
				const rsp = await AdminApi.getMemberList(searchOption, searchValue);
				console.log("멤버 조회 : ", rsp);
				
				// 응답이 성공적이면 멤버 리스트 상태에 저장
				if (rsp && rsp.data) {
					setMemberList(rsp.data);  // API 응답에 따라 데이터를 상태에 저장
				}
			} catch (error) {
				console.error("회원 목록 조회 실패:", error);
			}
		};
		
		// 검색 값이나 옵션이 바뀔 때마다 fetchMembers 실행
		fetchMembers();
	}, [searchValue, searchOption]);
	
	
	
	return (
		<BackGround>
			<Box sx={styles.container}>
				<ControlListHeader/>
				{/* 테이블 렌더링 */}
				<ControlListComponent list={memberList} />
				{/* 글 작성 버튼 (조건에 따라 표시) */}
			</Box>
		</BackGround>
	);
};

const styles = {
	container: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		padding: "20px",
		position: "relative",
	},
};



// 왼쪽 제목
const Title = styled.div`
    font-size: 24px;
    font-weight: bold;
`;

export default MemberControlMain;
