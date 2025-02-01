import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 훅
import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
`;

export const ModalContentPC = styled.div`
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

export const ModalContentMobile = styled.div`
  position: fixed;
  top: 100px;
  right: 0; /* 오른쪽에 고정 */
  width: 300px;
  height: 70%;
  background-color: white;
  padding: 20px;
  border-radius: 15px 0 0 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  z-index: 10000;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 20px;

  /* 스크롤 활성화 */
  overflow-y: auto;

  /* 스크롤바 커스터마이즈 (선택 사항) */
  ::-webkit-scrollbar {
    width: 8px; /* 스크롤바 너비 */
  }
  ::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3); /* 스크롤바 색상 */
    border-radius: 4px; /* 스크롤바 둥글게 */
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.5); /* 스크롤바 호버 색상 */
  }
  ::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.1); /* 스크롤 트랙 색상 */
  }
`;
const ModalTextLink = styled.span`
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  color: black;
  text-decoration: none;
`;

const LeftTitle = styled.div`
  margin-bottom: 5%;
  font-size: clamp(1.3rem, 1.8vw, 2.5rem);
  font-weight: bold;
`;

const SubTitle1 = styled.div`
  font-size: clamp(1rem, 1vw, 2.5rem);
  font-weight: bold;
  margin-bottom: 3%;
  margin-top: 3%;

  p {
    margin-top: 2%;
    font-size: clamp(0.8rem, 1vw, 1rem);
    font-weight: normal;
    cursor: pointer;
  }
`;

const SubTitle2 = styled.div`
  font-size: clamp(1rem, 1vw, 2.5rem);
  font-weight: bold;
  margin-bottom: 3%;
  margin-top: 3%;

  p {
    margin-top: 2%;
    font-size: clamp(0.8rem, 1vw, 1rem);
    font-weight: normal;
    cursor: pointer;
  }
`;

const SubTitle3 = styled.div`
  font-size: clamp(1rem, 1vw, 2.5rem);
  font-weight: bold;
  margin-bottom: 3%;
  margin-top: 3%;

  p {
    margin-top: 2%;
    font-size: clamp(0.8rem, 1vw, 1rem);
    font-weight: normal;
    cursor: pointer;
  }
`;

const SubTitle4 = styled.div`
  font-size: clamp(1rem, 1vw, 2.5rem);
  font-weight: bold;
  margin-bottom: 3%;
  margin-top: 3%;

  p {
    margin-top: 2%;
    font-size: clamp(0.8rem, 1vw, 1rem);
    font-weight: normal;
    cursor: pointer;
  }
`;

const SubTitle5 = styled.div`
 font-size: clamp(1rem, 1vw, 2.5rem);
  font-weight: bold;
  margin-bottom: 3%;
  margin-top: 3%;

  p {
    margin-top: 2%;
    font-size: clamp(0.8rem, 1vw, 1rem);
    font-weight: normal;
    cursor: pointer;
  }
`;

const MemberModal = ({ isOpen, closeModal, handleModalLinkClick, isAdmin }) => {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // 화면 크기 업데이트
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <ModalOverlay onClick={closeModal} />

      {windowWidth > 768 ? (
        <ModalContentPC>
          <ModalTextLink
            onClick={() => {navigate("/myPageNavBar");closeModal();}}>
            마이페이지
          </ModalTextLink>
          {isAdmin && (
            <ModalTextLink onClick={() => { navigate("/admin");closeModal();}}>
              관리자 페이지
            </ModalTextLink>
          )}
          <ModalTextLink onClick={() => handleModalLinkClick("logout")}>
            로그아웃
          </ModalTextLink>
        </ModalContentPC>
      ) : (
        <ModalContentMobile>
          <LeftTitle>마이 페이지</LeftTitle>
            <p onClick={() => navigate("")}>닉네임</p>

            <SubTitle1>
              나의 계정정보
              {/* CheckLogin을 사용하여 인증 후 정보수정 페이지로 바로 이동 */}
              <p>회원정보수정</p>
              <p onClick={() => {navigate(""); closeModal();}}>게시글</p>
              <p onClick={() => {navigate(""); closeModal();}}>업로드 권한 확인</p>
            </SubTitle1>

            <SubTitle2>
              나의 구매목록
              <p onClick={() => {navigate("/myPageNavBar/purchasedEnumPS"); closeModal();}}>구매한 자기소개서</p>
              <p onClick={() => {navigate("/myPageNavBar/purchasedEnumSR"); closeModal();}}>구매한 생활기록부</p>
            </SubTitle2>

            <SubTitle3>
              내가 작성한 글
              <p onClick={() => navigate("")}>게시글</p>
              <p onClick={() => navigate("")}>이용후기</p>
            </SubTitle3>
            
            <SubTitle4>
              자료 업로드
              <p onClick={() => {navigate("/myPageNavBar/coverLetterRegister"); closeModal();}}>자소서/생기부</p>
            </SubTitle4>

            <SubTitle5>
              내가 업로드한 파일
              <p onClick={() => {navigate("/myPageNavBar/UploadedEnumPS"); closeModal();}}>자기소개서</p>
              <p onClick={() => {navigate("/myPageNavBar/UploadedEnumSR"); closeModal();}}>생활기록부</p>
            </SubTitle5>
          {isAdmin && (
            <ModalTextLink
              onClick={() => {navigate("/admin"); closeModal();}}>
              관리자 페이지
            </ModalTextLink>
          )}
          <ModalTextLink onClick={() => handleModalLinkClick("logout")}>
            로그아웃
          </ModalTextLink>
        </ModalContentMobile>
      )}
    </>
  );
};

export default MemberModal;
