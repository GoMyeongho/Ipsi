import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MemberApi from "../api/MemberApi";
import ModalLoginPage from "../pages/auth/login/ModalLoginPage";
import MemberModal from "../pages/member/MemberMoal";
import LoginModal from "../pages/auth/login/LoginModal";
import SignupModal from "../pages/auth/signup/SingupModal";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../context/redux/PersistentReducer";
import {setLoginModalOpen, setModalOpen, setSignupModalOpen} from "../context/redux/ModalReducer";

const Background = styled.div`
  width: 100%;
  height: 100%;
`;

const ContainerBox = styled.div`
  @media (max-width: 768px) {
    width: 100%;
    height: 100px;
    background-color: white;
    position: fixed;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: #FFF;
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
    margin-left: 10%;
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

// Menu Bar 모달 스타일
const MenuBarModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
`;

const MenuBarModalContent = styled.div`
  position: fixed;
  top: 100px;
  right: 0; /* 오른쪽에 고정 */
  width: 300px;
  height: 70%;
  background: white;
  padding: 20px;
  border-radius: 15px 0 0 15px;
  border: 1px solid silver;
  text-align: center;
  z-index: 1000;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);

  /* 초기 상태: 화면 바깥 */
  transform: translateX(100%);
  transition: transform 3s ease; /* 부드러운 애니메이션 */

  /* 모달이 열릴 때 transform 적용 */
  ${({ isOpen }) =>
    isOpen &&
    `
    transform: translateX(0); /* 화면 안쪽으로 이동 */
  `}

  p {
    display: flex;
    justify-content: center;
    font-weight: bold;
    margin-Top: 20%; /* 항목 사이에 간격 추가 */
    cursor: pointer;
    &:hover {
      color: blue; /* 호버 시 색상 변경 */
    }
  }
`;

const SubMenu = styled.div`
  overflow: hidden;
  max-height: ${({ isOpen }) => (isOpen ? "200px" : "0")};
  transition: max-height 0.3s ease; /* 부드러운 애니메이션 */
  background-color: #f9f9f9;
  padding: ${({ isOpen }) => (isOpen ? "10px" : "0")};

  p {
    margin: 10px 0;
    cursor: pointer;
    &:hover {
      color: blue; /* 호버 시 색상 변경 */
    }
  }
`;

const MobileTopNavBar = () => {
  const navigate = useNavigate();

  const isModalOpen = useSelector(state => state.modal.isModalOpen);
  const [isMenuBarModalOpen, setIsMenuBarModalOpen] = useState(false);
  const isLoginModalOpen = useSelector(state => state.modal.isLoginModalOpen);
  const isSignupModalOpen = useSelector(state => state.modal.isSignupModalOpen);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const role = useSelector((state) => state.persistent.role);
  const dispatch = useDispatch();
  
  // MenuBar
  const menuBarOpenModal = () => setIsMenuBarModalOpen(true); // 입시자료 모달창 ON
  const menuBarCloseModal = () => setIsMenuBarModalOpen(false); // 입시자료 모달창 OFF

  // 입시자료 클릭 시 모달 닫고 페이지 전환
  const handleMenuBarModalNavigate = (path) => {
    setIsMenuBarModalOpen(false); // 모달 닫기
    navigate(path); // 페이지 전환
  };

  const handleImageClick = () => {
    dispatch(setModalOpen(true)); // 모달 열기
  };

  const closeModal = () => {
    dispatch(setModalOpen(false));
  };

  const closeLoginModal = () => {
    dispatch(setLoginModalOpen(false));
  };

  const closeSignupModal = () => {
    dispatch(setSignupModalOpen(false));
  };

  const handleModalLinkClick = (action) => {
    if (action === "login") {
      dispatch(setModalOpen(false));
      dispatch(setLoginModalOpen(true));
    } else if (action === "signup") {
      dispatch(setModalOpen(false));
      dispatch(setSignupModalOpen(true));
    } else if (action === "logout") {
      dispatch(logout());
      dispatch(setModalOpen(false)); // 모달 닫기
      navigate("/");
      alert("로그아웃 되었습니다.");
    } else if (action === "member") {
      navigate("/Member"); // 마이페이지 이동
      dispatch(setModalOpen(false)); // 모달 닫기
    }
  };

  const toggleSubMenu = () => {
    setIsSubMenuOpen((prev) => !prev); // 상태를 토글
  };
  

  return (
    <>
      <Background>
        <ContainerBox>
          <Logo>
            <LogoImage onClick={() => navigate("/")} />
          </Logo>
          <Info>
            <InfoImage onClick={menuBarOpenModal} />
          </Info>
          <MenuBar>
            <MenuBarImage onClick={handleImageClick} />
          </MenuBar>
        </ContainerBox>

        {/* 모달창 */}
        {/* 메뉴바 모달창 */}
        {isMenuBarModalOpen && (
          <MenuBarModalBackground onClick={menuBarCloseModal}>
            <MenuBarModalContent
              isOpen={isMenuBarModalOpen} // 상태값 전달
              onClick={(e) => e.stopPropagation()}
            >
              <p onClick={toggleSubMenu}>입시자료</p>
              <SubMenu isOpen={isSubMenuOpen}>
               <p onClick={() => handleMenuBarModalNavigate("/PersonalStatement")}>- 자기소개서</p>
               <p onClick={() => handleMenuBarModalNavigate("/StudentRecord")}>- 생활기록부</p>
              </SubMenu>
              <p onClick={() => {handleMenuBarModalNavigate("/PersonalStatementWrite");}}>자소서 작성</p>
              <p onClick={() => {handleMenuBarModalNavigate("/post/list/default");}}>게시판</p>
              <p onClick={() => {handleMenuBarModalNavigate("/");}}>FAQ</p>
              <p onClick={() => {handleMenuBarModalNavigate("/");}}>이용후기</p>
            </MenuBarModalContent>
          </MenuBarModalBackground>
        )}

        {/* 로그인 모달창 */}
        <ModalLoginPage
          isOpen={isModalOpen}
          closeModal={closeModal}
          handleModalLinkClick={handleModalLinkClick}
        />

        {(role !== "REST_USER" && role !== "") ? (
          <MemberModal
            isOpen={isModalOpen}
            closeModal={closeModal}
            handleModalLinkClick={handleModalLinkClick}
            isAdmin={role === "ROLE_ADMIN"}
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
          />
        )}
        {isSignupModalOpen && <SignupModal closeModal={closeSignupModal} />}
      </Background>
    </>
  );
};

export default MobileTopNavBar;
