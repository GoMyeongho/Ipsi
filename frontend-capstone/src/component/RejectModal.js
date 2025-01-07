import { useEffect } from "react";
import styled from "styled-components";  // styled-components import

const RejectModal = ({ message, onClose }) => {
	// useEffect로 3초 후에 모달을 자동으로 닫는 타이머 설정
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, 3000);
		
		return () => clearTimeout(timer);
	}, [message, onClose]);
	
	return (
		<ModalOverlay onClick={onClose}> {/* 클릭 시 모달 닫기 */}
			<ModalContent onClick={(e) => e.stopPropagation()}> {/* 모달 내부 클릭 시에는 닫히지 않게 설정 */}
				<Message>{message}</Message>
				<CloseButton onClick={onClose}>닫기</CloseButton> {/* 모달 닫기 버튼 */}
			</ModalContent>
		</ModalOverlay>
	);
};

export default RejectModal

// 스타일링된 컴포넌트들
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
  padding: 20px;
  border-radius: 10px;
  min-width: 300px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Message = styled.p`
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
`;

const CloseButton = styled.button`
  padding: 8px 16px;
  background-color: #ff6f61;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background-color: #ff3b2d;
  }
`;
