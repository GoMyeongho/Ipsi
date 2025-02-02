import React from "react";
import styled from "styled-components";

const OptionsModal = ({ open, message, options, onOption, onCancel }) => {
	if (!open) return null;
	
	return (
		<ModalOverlay onClick={onCancel}>
			<ModalContent onClick={(e) => e.stopPropagation()}>
				<ScrollWrapper>
					<MessageText>
						{message &&
							message.split("\n").map((line, index) => (
								<span key={index}>
                				{line}
									<br />
              				</span>
							))}
					</MessageText>
					<ModalActions>
						{options &&
							options.map((option, index) => (
								<ModalButton
									key={index}
									variant={option.type === "outlined" ? "outlined" : "contained"}
									color={option.type === "outlined" ? "error" : "primary"}
									onClick={() => onOption(option.value)}
								>
									{option.label}
								</ModalButton>
							))
						}
						<CancelButton onClick={onCancel}>취소</CancelButton>
					</ModalActions>
				</ScrollWrapper>
			</ModalContent>
		</ModalOverlay>
	);
};

export default OptionsModal;

// 스타일 정의
const ModalOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5); /* 배경 어두운 색 */
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 999;
`;

/*const ModalContent = styled.div`
	background-color: white;
	padding: 20px;
	border-radius: 8px;
	width: 300px;
	max-width: 100%;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	text-align: center;
	z-index: 1000;
`;*/
const ModalContent = styled.div`
    //width: 60%;
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    max-height: 70%;
    overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 30%;
	@media (min-width:1600px) { width: 20%; }
	@media (max-width:1200px) { width: 35%; }
	@media (max-width:1000px) { width: 50%; }
	@media (max-width:700px) { width: 60%; }
    &.delModal {
		overflow-y: auto;
		justify-content: center;
	}
`;

const ScrollWrapper = styled.div`
    max-height: 100%;
    overflow-y: auto;
    width: 100%;
    box-sizing: content-box;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const MessageText = styled.div`
	margin-bottom: 16px;
	font-size: 1.2rem;
	font-weight: bold;
`;

// 버튼 박스
const ModalActions = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
`;
// 이부분에 "create에 해당하는 조건 넣기
const ModalButton = styled.button`
	padding: 10px 20px;
	font-size: 1rem;
	font-weight: bold;
	cursor: pointer;
	background-color: ${({ variant }) => (variant === "outlined" ?  "transparent" : variant === "create" ? "create에 해당하는 값" : "#3f51b5")};
	color: ${({ variant }) => (variant === "outlined" ? "#f44336" : variant === "create" ? "create에 해당하는 값" :  "white")};
	border: ${({ variant }) => (variant === "outlined" ? "1px solid #f44336" : variant === "create" ? "create에 해당하는 값" :  "none")};
	border-radius: 8px;
	transition: background-color 0.3s;
	
	&:hover {
	background-color: ${({ variant }) => (variant === "outlined" ? "#f44336" : variant === "create" ? "create에 해당하는 값" :  "#303f9f")};
	}
`;

const CancelButton = styled.button`
	padding: 10px 20px;
	font-size: 1rem;
	font-weight: bold;
	cursor: pointer;
	background-color: transparent;
	color: #f44336;
	border: 1px solid #f44336;
	border-radius: 8px;
	transition: background-color 0.3s;
	
	&:hover {
	background-color: #f44336;
	color: white;
	}
`;
