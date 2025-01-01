import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Background = styled.div`
  width: 100%;
  height: 100px;
  top: 0;
  left: 0;
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 그림자 추가로 구분 */
  
  /* p 태그 스타일링 */
  p {
    cursor: pointer;
    font-weight: bold;
  }
`;

const Left = styled.div`
  width: 600px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  /* img 태그 스타일링 (LOGO) */
  img {
    width: 30%;
    cursor: pointer;
  }

  /* p 태그 스타일링 (NavBar page 항목)*/
  p {
    display: flex;
    justify-content: center;
    width: 100px;
  }
`;

const Right = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  /* img 태그 스타일링 */
  img {
    width: 50%;
    min-width: 50%; /* 최소 너비 설정 */
    cursor: pointer;
  }
`;

// 입시자료 모달 스타일
const MaterialModalBackground = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 1;
`;

const MatrialModalContent = styled.div`
  position: fixed; /* 고정 위치 */
  top: 80px; /* 화면 높이에 비례하여 위치 */
  left: 110px; /* 화면 너비에 비례하여 위치 */
  width: 200px;
  height: 100px;
  background: white;
  padding: 20px;
  border-radius: 15px;
  border: 1px solid silver;
  text-align: center;
  
  /* p 태그 스타일링 */
  p {
    margin-bottom: 10px;  /* 항목 사이에 간격 추가 */
  }
`;

// 로그인 모달 스타일
const LoginModalBackground = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 1;
`;

const LoginModalContent = styled.div`
  position: fixed; /* 고정 위치 */
  top: 80px; /* 화면 높이에 비례하여 위치 */
  right: 40px; /* 화면 너비에 비례하여 위치 */
  width: 200px;
  height: 100px;
  background: white;
  padding: 20px;
  border-radius: 15px;
  border: 1px solid silver;
  text-align: center;
  
  /* p 태그 스타일링 */
  p {
    margin-bottom: 10px;  /* 항목 사이에 간격 추가 */
  }
`;

const TopNavBar = () => {
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false); // 입시자료 모달 상태 관리
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // 로그인 모달 상태 관리
  const navigate = useNavigate(); // 페이지 전환 훅

  const materialOpenModal = () => setIsMaterialModalOpen(true); // 입시자료 모달창 ON
  const materialCloseModal = () => setIsMaterialModalOpen(false); // 입시자료 모달창 OFF

  const loginOpenModal = () => setIsLoginModalOpen(true); // 로그인 모달창 ON
  const loginCloseModal = () => setIsLoginModalOpen(false); // 로그인인 모달창 OFF

  // 입시자료 클릭 시 모달 닫고 페이지 전환
  const handleMaterialNavigate = (path) => {
    setIsMaterialModalOpen(false); // 모달 닫기
    navigate(path); // 페이지 전환
  };

  // 로그인 모달 클릭 시 페이지 전환
  const handleLoginNavigate = (path) => {
    setIsLoginModalOpen(false); // 모달 닫기
    navigate(path); // 페이지 전환
  };

  return (
    <>
      <Background>
        <Left>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/photo-island-eeaa3.firebasestorage.app/o/KH_Comprehensive_Project%2Fipsi%20Logo.png?alt=media&token=5bf92de0-1097-4148-9546-c1ed3bb887a6"
            alt="Logo"
          />
          <p onClick={materialOpenModal}>입시자료</p>
          <p onClick={() => navigate("/")}>자소서 작성</p>
          <p onClick={() => navigate("/")}>게시판</p>
          <p onClick={() => navigate("/")}>이용후기</p>
        </Left>
        <Right>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/photo-island-eeaa3.firebasestorage.app/o/KH_Comprehensive_Project%2FProfile_Purple.png?alt=media&token=642c5e26-bc81-4de9-9ccf-48662874e946"
            alt="Profile"
            onClick={loginOpenModal}
          />
        </Right>

        {/* 모달창 */}
        {/* 입시자료 모달창 */}
        {isMaterialModalOpen && (
          <MaterialModalBackground onClick={materialCloseModal}>
            <MatrialModalContent onClick={(e) => e.stopPropagation()}>
              <p onClick={() => handleMaterialNavigate("/coverLetter")}>
                자기소개서
              </p>
              <p onClick={() => handleMaterialNavigate("/")}>생활기록부</p>
            </MatrialModalContent>
          </MaterialModalBackground>
        )}

        {/* 로그인 모달창 */}
        {isLoginModalOpen && (
          <LoginModalBackground onClick={loginCloseModal}>
            <LoginModalContent onClick={(e) => e.stopPropagation()}>
              <p onClick={() => handleLoginNavigate("/")}>회원가입</p>
              <p onClick={() => handleLoginNavigate("/")}>로그인</p>
            </LoginModalContent>
          </LoginModalBackground>
        )}
      </Background>
    </>
  );
};

export default TopNavBar;
