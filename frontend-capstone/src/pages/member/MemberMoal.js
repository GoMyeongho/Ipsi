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

const MemberModal = ({ isOpen, closeModal, handleModalLinkClick }) => {

  if (!isOpen) return null;

  // const handleNavigate = () => {
  //   closeModal(); // 모달 닫기
  //   navigate("/Member"); // 해당 경로로 이동
  // };
  // const handleLogout = () => {
  //   // 로그아웃 처리
  //   closeModal(); // 모달 닫기
  //   localStorage.removeItem("loggedInUserId"); // 로컬스토리지 데이터 삭제
  //   handleModalLinkClick(false); // 로그인 상태 false로 업데이트
  //   navigate("/"); // 홈으로 이동
  //   alert("로그아웃 되었습니다."); // 알림
  // };

  return (
    <>
      <ModalOverlay onClick={closeModal} />
      <ModalContent>
        <ModalTextLink onClick={() => handleModalLinkClick("member")}>
          마이페이지
        </ModalTextLink>
        <ModalTextLink onClick={() => handleModalLinkClick("logout")}>
          로그아웃
        </ModalTextLink>
      </ModalContent>
    </>
  );
};

export default MemberModal;
