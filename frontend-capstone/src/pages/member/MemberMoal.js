import React from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 훅
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
`;

const ModalContent = styled.div`
  position: fixed;
  top: 100px;
  right: 40px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10000;
  width: 231px;
  height: 133px;
  border-radius: 20px;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 20px;
`;

const ModalTextLink = styled.span`
  font-size: 1rem;
  cursor: pointer;
  color: black;
  text-decoration: none;
`;

const MemberModal = ({ isOpen, closeModal, handleModalLinkClick, isAdmin }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <>
      <ModalOverlay onClick={closeModal} />
      <ModalContent>
        <ModalTextLink onClick={() => {navigate("/myPageNavBar"); closeModal()}}>
          마이페이지
        </ModalTextLink>
        {isAdmin && <ModalTextLink onClick={() => {navigate("/admin"); closeModal()}}>
          관리자 페이지
        </ModalTextLink> }
        <ModalTextLink onClick={() => handleModalLinkClick("logout")}>
          로그아웃
        </ModalTextLink>
      </ModalContent>
    </>
  );
};

export default MemberModal;
