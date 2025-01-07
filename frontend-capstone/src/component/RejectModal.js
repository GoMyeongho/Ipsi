import React from "react";
import styled from "styled-components";  // styled-components import

const RejectModal = ({ open, message, onClose }) => {
	console.log(open);
	console.log(message);
	if (!open) return null;  // open이 false이면 모달을 렌더링하지 않음
	
	return (
		<ModalOverlay onClick={onClose}> {/* 클릭 시 모달 닫기 */}
			<ModalContent onClick={(e) => e.stopPropagation()}> {/* 모달 내부 클릭 시에는 닫히지 않게 설정 */}
				<Message>{message}</Message>
				<CloseButton onClick={onClose}>닫기</CloseButton> {/* 모달 닫기 버튼 */}
			</ModalContent>
		</ModalOverlay>
	);
};

export default RejectModal;

// 기본 스타일 (Desktop 및 900px 이상의 화면에서 적용)
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);  /* 어두운 배경 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: white;
    padding: 30px;  /* 여유 공간을 충분히 */
    border-radius: 10px;
    min-width: 400px;  /* 화면이 900px 이상일 때 적용 */
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 600px;  /* 최대 너비 제한 */

    // 900px 이하일 때 모바일 스타일
    @media (max-width: 900px) {
        min-width: 250px;  /* 모바일 화면 크기에 맞게 크기 축소 */
        padding: 20px;  /* 패딩을 줄여서 공간 절약 */
        max-width: 90%;  /* 모바일에서는 최대 너비 90%로 제한 */
    }
`;

const Message = styled.p`
    font-size: 16px;
    color: #333;
    margin-bottom: 20px;

    // 900px 이하일 때 모바일 스타일
    @media (max-width: 900px) {
        font-size: 14px;  /* 모바일에서 글씨 크기 줄이기 */
        margin-bottom: 10px;  /* 여백도 줄이기 */
    }
`;

const CloseButton = styled.button`
    padding: 12px 24px;  /* 기본 버튼 크기 */
    background-color: #ff6f61;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;

    &:hover {
        background-color: #ff3b2d;
    }

    // 900px 이하일 때 모바일 스타일
    @media (max-width: 900px) {
        padding: 10px 20px;  /* 모바일에서 버튼 크기 줄이기 */
        font-size: 14px;  /* 글씨 크기 줄이기 */
    }
`;
