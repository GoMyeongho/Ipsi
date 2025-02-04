import React from "react";
import styled from "styled-components";

const TermsModal = ({ isOpen, title, content, onClose }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <Content>{content}</Content>
        <CloseButton onClick={onClose}>닫기</CloseButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TermsModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 350px; /* 모달 크기 조정 */
  max-height: 70vh; /* 창 높이가 길어지면 스크롤 */
  overflow-y: auto; /* 스크롤 추가 */
  text-align: center;
`;

const Content = styled.p`
  white-space: pre-line;
  text-align: left;
  line-height: 1.5;
`;

const CloseButton = styled.button`
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #5f53d3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;
