import { useContext } from "react";
import { PermissionContext } from "../../../../context/admin/PermissionStore";
import { BackGround } from "../../../../styles/GlobalStyle";
import { Button } from "@mui/material";
import styled from "styled-components";


const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    margin-top: 20px;
    padding: 10px;
`;

const PermissionCategorySelector = () => {
	const { permissionCategory, setPermissionCategory } = useContext(PermissionContext);
	
	const categoryList = [
		{ name: "요청 목록", id: "INACTIVE" },
		{ name: "처리 목록", id: "ACTIVE" },
	];
	
	const handleCategoryClick = (id) => {
		setPermissionCategory(id);
	};
	
	return (
		<BackGround>
			<ButtonContainer>
				{categoryList.map((category) => (
					<Button
						key={category.id}
						onClick={() => handleCategoryClick(category.id)}
						sx={{
							backgroundColor: permissionCategory === category.id ? "#6054d4" : "#e0cefe",
							color: permissionCategory === category.id ? "#fff" : "#4a3f9d",
							fontWeight: "bold",
							borderRadius: "8px",
							padding: "10px 20px",
							textTransform: "none", // 기본 대문자 변환 방지
							zIndex: "1",
							"&:hover": {
								backgroundColor: permissionCategory === category.id ? "#5241a2" : "#c6b8f7",
							},
						}}
					>
						{category.name}
					</Button>
				))}
			</ButtonContainer>
		</BackGround>
	);
};

export default PermissionCategorySelector;
