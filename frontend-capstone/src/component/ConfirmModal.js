import styled from "styled-components";
import {Button} from "@mui/material";

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); /* 어두운 반투명 배경 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* 모달이 항상 최상위에 위치하도록 설정 */
`;

const ModalContent = styled.div`
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
	return (
		<ModalOverlay>
			<ModalContent>
				<p>{message}</p>
				<Button onClick={onConfirm}>확인</Button>
				<Button onClick={onCancel}>취소</Button>
			</ModalContent>
		</ModalOverlay>
	);
};

export default ConfirmModal;
