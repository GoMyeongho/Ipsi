import {useContext, useEffect, useState} from "react";
import { BackGround } from "../../styles/GlobalStyle";
import styled from "styled-components";
import { Paper } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { PermissionContext } from "../../context/admin/PermissionStore";
import {useSelector} from "react-redux";
import RejectModal from "../../component/Modal/RejectModal";

// AdminNavContainer 스타일링 (MUI Paper의 스타일링 적용)
const AdminNavContainer = styled(Paper)`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 300px;
		height: 300px;
    margin: 50px 30px;
    padding: 20px;
    border-radius: 16px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1); /* Paper 스타일에 그림자 추가 */
    background-color: #ece1ff; /* 연보라색 배경 */
`;

const AdminContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: flex-start;
`;

const StyledButton = styled.button`
  width: 100%;
  margin: 12px 0;
  border-radius: 12px;
  text-transform: none;
  font-weight: bold;
  padding: 10px 0;
  background-color: ${(props) => (props.isActive ? "#6154D4" : "transparent")};
  color: ${(props) => (props.isActive ? "#fff" : "#000")};  /* 비활성화 상태에서 글씨색을 검정으로 변경 */
  border: ${(props) => (props.isActive ? "2px solid #6154D4" : "2px solid transparent")};
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #6154D4;
    color: #fff;
    border: 2px solid #6154D4;
    transform: scale(1.05);  /* Hover 시 버튼 크기 확대 효과 */
  }
`;

const AdminNav = () => {
	const navList = [
		{ name: "메인 페이지", id: "main", link: "/admin" },
		{ name: "권한 부여 페이지", id: "auth", link: "/admin/auth" },
		{ name: "게시글 관리 페이지", id: "board", link: "/admin/board/default" },
		{ name: "회원 관리 페이지", id: "member", link: "/admin/member/default/0" },
	];
	const [reject, setReject] = useState({});
	const role = useSelector(state => state.persistent.role)
	useEffect(() => {
		if(role !== "ROLE_ADMIN"){
			setReject({value: true, label: "해당 페이지를 확인할 권한이 없습니다."})
		}
	}, [role]);
	
	const navigate = useNavigate();
	const { page } = useContext(PermissionContext);
	
	const handleOnClick = (e) => {
		navigate(e.link);
	};
	
	return (
		<BackGround>
			<AdminContainer>
				<AdminNavContainer elevation={3}>
					{navList.map((nav) => (
						<StyledButton
							key={nav.id}
							onClick={() => handleOnClick(nav)}
							isActive={nav.id === page}  // 활성화된 버튼에 스타일 적용
						>
							{nav.name}
						</StyledButton>
					))}
				</AdminNavContainer>
				<Outlet />
			</AdminContainer>
			<RejectModal onClose={() => navigate("/")} open={reject.value} message={reject.label} />
		</BackGround>
	);
};

export default AdminNav;
