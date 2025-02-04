import { useContext } from "react";
import { Button } from "@mui/material";
import styled from "styled-components";
import {PermissionContext} from "../../../context/admin/PermissionStore";
import {BackGround} from "../../../styles/GlobalStyle";
import {useNavigate} from "react-router-dom";


const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    margin-top: 20px;
    padding: 10px;
`;

const BoardCategorySelector = () => {
	const { boardCategory, setBoardCategory } = useContext(PermissionContext);
	const navigator = useNavigate();
	
	const categoryList = [
		{ name: "게시판", id: "default" },
		{ name: "FAQ", id: "faq" },
		{ name: "리뷰", id: "review" },
	];
	
	const handleCategoryClick = (id) => {
		setBoardCategory(id);
		navigator(`/admin/board/${id}`)
	};
	
	return (
		<BackGround>
			<ButtonContainer>
				{categoryList.map((category) => (
					<Button
						key={category.id}
						onClick={() => handleCategoryClick(category.id)}
						sx={{
							backgroundColor: boardCategory === category.id ? "#6054d4" : "#e0cefe",
							color: boardCategory === category.id ? "#fff" : "#4a3f9d",
							fontWeight: "bold",
							borderRadius: "8px",
							padding: "10px 20px",
							textTransform: "none", // 기본 대문자 변환 방지
							zIndex: "1",
							"&:hover": {
								backgroundColor: boardCategory === category.id ? "#5241a2" : "#c6b8f7",
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

export default BoardCategorySelector;
