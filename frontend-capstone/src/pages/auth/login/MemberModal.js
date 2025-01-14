import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Commons from "../utill/Common"; // Common 유틸리티

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

const MemberModal = ({ isOpen, closeModal, handleModalLinkClick }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  // 로그아웃 처리 함수
  const handleLogout = () => {
    Commons.removeAccessToken();  // accessToken 삭제
    Commons.removeRefreshToken();  // refreshToken 삭제
    console.log("로그아웃 성공");
    alert("로그아웃 되었습니다.");  // 알림

    // 로그아웃 후 로그인 페이지로 리다이렉트
    closeModal(); // 모달 닫기
    navigate("/login", { replace: true }); // 로그인 페이지로 이동
  };

  return (
    <>
      <ModalOverlay onClick={closeModal} />
      <ModalContent>
        <ModalTextLink onClick={() => handleModalLinkClick("member")}>
          마이페이지
        </ModalTextLink>
        <ModalTextLink onClick={handleLogout}>
          로그아웃
        </ModalTextLink>
      </ModalContent>
    </>
  );
};

export default MemberModal;
