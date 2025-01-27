import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MemberApi from "../api/MemberApi";
import ModalLoginPage from "../pages/auth/login/ModalLoginPage";
import MemberModal from "../pages/member/MemberMoal";
import LoginModal from "../pages/auth/login/LoginModal";
import SignupModal from "../pages/auth/signup/SingupModal";

const Background = styled.div`
  width: 100%;
  height: 100%;
`;

const ContainerBox = styled.div`
  @media (max-width: 768px) {
    width: 100%;
    height: 100px;
    position: fixed;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
`;

const Logo = styled.div`
  @media (max-width: 768px) {
    width: 100%;
    display: flex;
    justify-content: start;
    align-items: center;
    left: 0;
  }
`;

const LogoImage = styled.div`
  @media (max-width: 768px) {
    width: 200px;
    height: 100px;
    background-image: url(https://firebasestorage.googleapis.com/v0/b/ipsi-f2028.firebasestorage.app/o/firebase%2Flogo%2Flogo.png?alt=media&token=cc98e0e8-541c-4e62-8aa7-fd408e8b32f2);
    background-size: contain; /* 이미지를 컨테이너에 맞게 조정 */
    background-position: center; /* 이미지 중앙 정렬 */
    background-repeat: no-repeat; /* 반복 방지 */
    cursor: pointer;
  }
`;

const Info = styled.div`
  @media (max-width: 768px) {
    width: 30%;
    display: flex;
    justify-content: right;
    align-items: center;
  }
`;

const InfoImage = styled.div`
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    background-image: url(https://firebasestorage.googleapis.com/v0/b/photo-island-eeaa3.firebasestorage.app/o/PAIKBOOKER_BRAND_IMG%2Fmenu.png?alt=media&token=1e6a8fcb-94a6-4640-bdcb-3d57adf8aebd);
    background-size: cover; /* 이미지를 컨테이너에 맞게 조정 */
    background-position: center; /* 이미지 중앙 정렬 */
    background-repeat: no-repeat; /* 반복 방지 */
    filter: grayscale(100%) contrast(100%) brightness(0%); // 이미지 색상
    cursor: pointer;
  }
`;

const MenuBar = styled.div`
  @media (max-width: 768px) {
    width: 30%;
    display: flex;
    justify-content: right;
    align-items: center;
  }
`;

const MenuBarImage = styled.div`
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    margin-right: 20%;
    background-image: url(https://firebasestorage.googleapis.com/v0/b/photo-island-eeaa3.firebasestorage.app/o/PAIKBOOKER_BRAND_IMG%2Fperson_24dp_E8EAED.png?alt=media&token=3be47ba9-ed2f-41cd-813c-3d85bb1a3328);
    color: black;
    background-size: cover; /* 이미지를 컨테이너에 맞게 조정 */
    background-position: center; /* 이미지 중앙 정렬 */
    background-repeat: no-repeat; /* 반복 방지 */
    filter: grayscale(100%) contrast(100%) brightness(0%); // 이미지 색상
    cursor: pointer;
  }
`;

// 입시자료 모달 스타일
const MenuBarModalBackground = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 1000;
`;

const MenuBarModalContent = styled.div`
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
    margin-bottom: 10px; /* 항목 사이에 간격 추가 */
  }
`;


const MobileTopNavBar = () => {
  const navigate = useNavigate();

  const [isModalOpen, setModalOpen] = useState(false);
  const [isMenuBarModalOpen, setIsMenuBarModalOpen] = useState(false);
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
        const rsp = await MemberApi.isAdmin();
        console.log(rsp);
        if (rsp) {
          setAdmin(rsp.data);
        } else {
          //실패시 보여줄 부분
        }
      } catch (error) {
        console.log(error);
      }
    };
    adminVerify();
  }, [isAdmin]);

  // MenuBar
  const menuBarOpenModal = () => setIsMenuBarModalOpen(true); // 입시자료 모달창 ON
  const menuBarCloseModal = () => setIsMenuBarModalOpen(false); // 입시자료 모달창 OFF

  // 입시자료 클릭 시 모달 닫고 페이지 전환
  const handleMaterialNavigate = (path) => {
    setIsMenuBarModalOpen(false); // 모달 닫기
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
        <ContainerBox>
          <Logo>
            <LogoImage onClick={() => navigate("/")} />
          </Logo>
          <Info>
            <InfoImage />
          </Info>
          <MenuBar>
            <MenuBarImage onClick={handleImageClick}/>
          </MenuBar>
        </ContainerBox>

        {/* 모달창 */}
        {/* 메뉴바 모달창 */}
        {isMenuBarModalOpen && (
          <MenuBarModalBackground onClick={menuBarCloseModal}>
            <MenuBarModalContent onClick={(e) => e.stopPropagation()}>
              <p onClick={() => handleMaterialNavigate("/PersonalStatement")}>
                자기소개서
              </p>
              <p onClick={() => handleMaterialNavigate("/StudentRecord")}>
                생활기록부
              </p>
            </MenuBarModalContent>
          </MenuBarModalBackground>
        )} 
        
        {/* 로그인 모달창 */}
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
      </Background>
    </>
  );
};

export default MobileTopNavBar;
