import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {useState} from "react";
import ModalLoginPage from "../pages/auth/login/ModalLoginPage";
import MemberModal from "../pages/member/MemberMoal";
import LoginModal from "../pages/auth/login/LoginModal";
import SignupModal from "../pages/auth/signup/SingupModal";
import {useDispatch, useSelector} from "react-redux";
import {logout, setAccessToken, setRefreshToken, setRole} from "../context/redux/PersistentReducer";
import {
  setModalOpen,
  setLoginModalOpen,
  setSignupModalOpen,
  setIsMaterialModalOpen
} from "../context/redux/ModalReducer";
import RejectModal from "./Modal/RejectModal";


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
    margin-bottom: 10px; /* 항목 사이에 간격 추가 */
  }
`;

const TopNavBar = () => {
  const navigate = useNavigate(); // 페이지 전환 훅
  const [reject, setReject] = useState({});
  const dispatch = useDispatch();
  const role = useSelector((state) => state.persistent.role);
  const isMaterialModalOpen = useSelector((state) => state.modal.isMaterialModalOpen);
  const isLoginModalOpen = useSelector((state) => state.modal.isLoginModalOpen);
  const isSignupModalOpen = useSelector((state) => state.modal.isSignupModalOpen);
  const isModalOpen = useSelector((state) => state.modal.isModalOpen);

  const materialOpenModal = () => dispatch(setIsMaterialModalOpen(true)); // 입시자료 모달창 ON
  const materialCloseModal = () => dispatch(setIsMaterialModalOpen(false)); // 입시자료 모달창 OFF
  
  
  
  
  // 입시자료 클릭 시 모달 닫고 페이지 전환
  const handleMaterialNavigate = (path) => {
    dispatch(setIsMaterialModalOpen(false)); // 모달 닫기
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
      dispatch(logout())
      dispatch(setModalOpen(false)); // 모달 닫기
      setReject({message: "로그아웃 했습니다.", active: true});
    } else if (action === "member") {
      navigate("/Member"); // 마이페이지 이동
      dispatch(setModalOpen(false)); // 모달 닫기
    }
  };

  return (
    <>
      <Background>
        <Left>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/ipsi-f2028.firebasestorage.app/o/firebase%2Flogo%2Flogo.png?alt=media"
            alt="Logo"
            onClick={() => navigate("/")}
          />
          <p onClick={materialOpenModal}>입시자료</p>
          <p onClick={() => navigate("/PersonalStatementWrite")}>자소서 작성</p>
          <p onClick={() => navigate("/post/list/default")}>게시판</p>
          <p onClick={() => navigate("/post/list/faq")}>FAQ</p>
          <p onClick={() => navigate("/post/list/review")}>이용후기</p>
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
              <p onClick={() => handleMaterialNavigate("/StudentRecord")}>
                생활기록부
              </p>
            </MatrialModalContent>
          </MaterialModalBackground>
        )}

        {/* 로그인 모달창 */}
        <ModalLoginPage
          isOpen={isModalOpen}
          closeModal={closeModal}
          handleModalLinkClick={handleModalLinkClick}
        />

        {role ? (
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
        <RejectModal open={reject.active} onClose={() => setReject("")} message={reject.message}></RejectModal>
      </Background>
    </>
  );
};

export default TopNavBar;
