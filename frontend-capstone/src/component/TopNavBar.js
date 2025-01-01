import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
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
  
  /* p 태그 스타일링 */
  p {
    cursor: pointer;
    font-weight: bold;
  }
`

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

  /* p 태그 스타일링 */
  p {
    display: flex;
    justify-content: center;
    width: 100px;
  }
`

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
`

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
`;

const TopNavBar = () => {
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false); // 입시자료 모달 상태 관리
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // 로그인 모달 상태 관리
  const navigate = useNavigate(); // 페이지 전환 훅
  
  const materialOpenModal = () => setIsMaterialModalOpen(true); // 입시자료 모달창 ON
  const materialCloseModal = () => setIsMaterialModalOpen(false); // 입시자료 모달창 OFF

  const loginOpenModal = () => setIsLoginModalOpen(true); // 로그인 모달창 ON
  const loginCloseModal = () => setIsLoginModalOpen(false); // 로그인인 모달창 OFF

  return(
    <>
      <Background>
        <Left>
          <img src="https://firebasestorage.googleapis.com/v0/b/photo-island-eeaa3.firebasestorage.app/o/KH_Comprehensive_Project%2Fipsi%20Logo.png?alt=media&token=5bf92de0-1097-4148-9546-c1ed3bb887a6"
              alt="Logo"
           />
           <p onClick={materialOpenModal}>입시자료</p>
           <p onClick={() => navigate('/')}>자소서 작성</p>
           <p onClick={() => navigate('/')}>게시판</p>
           <p onClick={() => navigate('/')}>이용후기</p>
        </Left>
        <Right>
           <img
             src="https://firebasestorage.googleapis.com/v0/b/photo-island-eeaa3.firebasestorage.app/o/KH_Comprehensive_Project%2FProfile.png?alt=media&token=a5366590-064f-4b63-af8a-cb3ca2e83fc2"
             alt="Profile"
             onClick={loginOpenModal}
           />
        </Right>      

        {/* 모달창 */}
        {/* 입시자료 모달창 */}
        {isMaterialModalOpen && (
          <MaterialModalBackground onClick={materialCloseModal} >
            <MatrialModalContent onClick={(e)=> e.stopPropagation()}>
              <p onClick={() => navigate('/')}>자기소개서</p>
              <p onClick={() => navigate('/')}>생활기록부</p>
            </MatrialModalContent>
          </MaterialModalBackground>
        )}

        {/* 로그인 모달창 */} 
        {isLoginModalOpen && (
          <LoginModalBackground onClick={loginCloseModal}>
            <LoginModalContent onClick={(e)=> e.stopPropagation()}>
              <p onClick={() => navigate('/')}>회원가입</p>
             <p onClick={() => navigate('/')}>로그인</p>
            </LoginModalContent>
          </LoginModalBackground>
        )}
      </Background>
    </>
  )
}

export default TopNavBar;