import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import MemberApi from "../api/MemberApi";
import ModalLoginPage from "../pages/auth/login/ModalLoginPage";
import MemberModal from "../pages/member/MemberMoal";
import LoginModal from "../pages/auth/login/LoginModal";
import SignupModal from "../pages/auth/signup/SingupModal";

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
  max-width: 700px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  /* img 태그 스타일링 (LOGO) */
  img {
    width: 200px;
    height: 40px;
    cursor: pointer;
    margin: 0 20px;
  }

  /* p 태그 스타일링 (NavBar page 항목)*/
  p {
    display: flex;
    justify-content: center;
    margin: 0 10px;
  }
`;

const Right = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  /* img 태그 스타일링 */
  img {
    width: 90px;
    height: 50px; /* 최소 너비 설정 */
    object-fit: cover;
    cursor: pointer;
    margin-right: 20px;
  }
`;

// 입시자료 모달 스타일
const MaterialModalBackground = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 1000;
`;

const MatrialModalContent = styled.div`
  position: fixed; /* 고정 위치 */
  top: 80px; /* 화면 높이에 비례하여 위치 */
  left: 200px; /* 화면 너비에 비례하여 위치 */
  width: 200px;
  height: 100px;
  background: white;
  padding: 20px;
  border-radius: 15px;
  border: 1px solid silver;
  text-align: center;
  z-index: 1000;
  
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
  right: 20px; /* 화면 너비에 비례하여 위치 */
  width: 150px;
  height: 100px;
  background: white;
  padding: 20px;
  border-radius: 15px;
  border: 1px solid silver;
  text-align: center;
  
  /* p 태그 스타일링 */
  p {
    margin-bottom: 10px; /* 항목 사이에 간격 추가 */
  }
`;

const TopNavBar = () => {
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false); // 입시자료 모달 상태 관리
  
  const navigate = useNavigate(); // 페이지 전환 훅
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const [isAdmin, setAdmin] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(
    // !!localStorage.getItem("loggedInUserId")
    !!localStorage.getItem("accessToken") // 토큰 여부로 로그인 상태 결정
  );
  useEffect(() => {
    const adminVerify = async () => {
      try {
        const rsp = await MemberApi.isAdmin()
        console.log(rsp)
        if (rsp) {
          setAdmin(rsp.data)
        } else {
          //실패시 보여줄 부분
        }
      } catch (error) {
        console.log(error)
      }
    }
    adminVerify();
  }, [isAdmin]);
  

  const materialOpenModal = () => setIsMaterialModalOpen(true); // 입시자료 모달창 ON
  const materialCloseModal = () => setIsMaterialModalOpen(false); // 입시자료 모달창 OFF
  
  // 입시자료 클릭 시 모달 닫고 페이지 전환
  const handleMaterialNavigate = (path) => {
    setIsMaterialModalOpen(false); // 모달 닫기
    navigate(path); // 페이지 전환
  };
  const handleImageClick = () => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token); // 토큰이 있으면 로그인 상태 true
    setModalOpen(true); // 모달 열기
  };
  
  const closeModal = () => {
    setModalOpen(false);
  };
  
  const closeLoginModal = () => {
    setLoginModalOpen(false);
  };
  
  const closeSignupModal = () => {
    setSignupModalOpen(false);
  };

  const handleModalLinkClick = (action) => {
    if (action === "login") {
      setModalOpen(false);
      setLoginModalOpen(true);
    } else if (action === "signup") {
      setModalOpen(false);
      setSignupModalOpen(true);
    } else if (action === "logout") {
      setIsLoggedIn(false); // 로그인 상태 false
      localStorage.clear(); // 로컬스토리지 삭제

      localStorage.removeItem("accessToken"); // 토큰 삭제

      setModalOpen(false); // 모달 닫기
      navigate("/");
      alert("로그아웃 되었습니다.");
    } else if (action === "member") {
      navigate("/Member"); // 마이페이지 이동
      setModalOpen(false); // 모달 닫기
    }
  };

  

  return (
    <>
      <Background>
        <Left>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/ipsi-f2028.firebasestorage.app/o/firebase%2Flogo%2Flogo.png?alt=media"
            alt="Logo"
          />
          <p onClick={materialOpenModal}>입시자료</p>
          <p onClick={() => navigate("/PersonalStatementWrite")}>자소서 작성</p>
          <p onClick={() => navigate("/post/list/default")}>게시판</p>
          <p onClick={() => navigate("/")}>FAQ</p>
          <p onClick={() => navigate("/")}>이용후기</p>
        </Left>
        <Right>
        <img
            src="https://firebasestorage.googleapis.com/v0/b/ipsi-f2028.firebasestorage.app/o/firebase%2Fprofile%2FProfile_Purple.png?alt=media"
            alt="Profile"
            onClick={handleImageClick}
          />
        </Right>

        {/* 모달창 */}
        {/* 입시자료 모달창 */}
        {isMaterialModalOpen && (
          <MaterialModalBackground onClick={materialCloseModal}>
            <MatrialModalContent onClick={(e) => e.stopPropagation()}>
              <p onClick={() => handleMaterialNavigate("/PersonalStatement")}>
                자기소개서
              </p>
              <p onClick={() => handleMaterialNavigate("/StudentRecord")}>생활기록부</p>
            </MatrialModalContent>
          </MaterialModalBackground>
        )}

        {/* 로그인 모달창 */}
      </Background>
      <ModalLoginPage
        isOpen={isModalOpen}
        closeModal={closeModal}
        handleModalLinkClick={handleModalLinkClick}
      />
      
      {isLoggedIn ? (
        <MemberModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          handleModalLinkClick={handleModalLinkClick}
          setIsLoggedIn={setIsLoggedIn}
          isAdmin={isAdmin}
        />
      ) : (
        <ModalLoginPage
          isOpen={isModalOpen}
          closeModal={closeModal}
          handleModalLinkClick={handleModalLinkClick}
        />
      )}
      
      {isLoginModalOpen && (
        <LoginModal
          closeModal={closeLoginModal}
          setIsLoggedIn={setIsLoggedIn}
        />
      )}
      {isSignupModalOpen && <SignupModal closeModal={closeSignupModal} />}
    </>
  );
};

export default TopNavBar;
