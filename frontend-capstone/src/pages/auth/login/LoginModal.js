import React, { useState } from "react";
import styled from "styled-components";
import AuthApi from "../../../api/AuthApi";
import SignupModal from "../signup/SingupModal";
import FindPw from "../findPw/FIndPw";
import FindIdByPhone from "../findId/FindIdByPhone";
import { useNavigate } from "react-router-dom";
import Commons from "../../../util/Common";

// 도메인 및 API URL 설정

// 모달 배경
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
`;

const SocialButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px; // 버튼 간 간격
`;

// const NaverButton = styled.button`
//   width: 100%;
//   height: 45px;
//   background-image: url("https://firebasestorage.googleapis.com/v0/b/ipsi-f2028.firebasestorage.app/o/firebase%2Flogo%2FbtnG_완성형.png?alt=media");
//   background-size: cover;
//   background-position: center;
//   background-repeat: no-repeat;
//   border: none;
//   border-radius: 20px;
//   cursor: pointer;
//   margin-top: 10px;
//   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); // 쉐도우 추가

//   &:hover {
//     opacity: 0.9;
//     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); // Hover 시 쉐도우 강조
//   }
// `;

// Kakao 버튼 스타일
// const KakaoButton = styled.button`
//   width: 100%;
//   height: 45px;
//   background-image: url("https://firebasestorage.googleapis.com/v0/b/ipsi-f2028.firebasestorage.app/o/firebase%2Flogo%2Fkakao_login_large_wide.png?alt=media");
//   background-size: cover;
//   background-position: center;
//   background-repeat: no-repeat;
//   border: none;
//   border-radius: 20px;
//   cursor: pointer;
//   margin-top: 10px;
//   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); // 쉐도우 추가

//   &:hover {
//     opacity: 0.9;
//     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); // Hover 시 쉐도우 강조
//   }
// `;

const NaverButton = styled.button`
  width: 100%;
  height: 45px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 10px;
  background-color: #03c75a;    // 네이버에서 스포이드로 가져옴
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2vw;
  > p {
    font-size: 16px;
    color: #FFF;
  }
`;


const KakaoButton = styled.button`
  width: 100%;
  height: 45px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 10px;
  background-color: #fee500;    // 카카오에서 스포이드로 가져옴
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2vw;
  > p {
    font-size: 16px;
    color: #3e2723; // 카카오 로고에서 스포이드로 가져옴
  }
`;


const LogoImg = styled.img`
    width: 25px;
    cursor: pointer;
`


// 모달 콘텐츠
const ModalContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  z-index: 9999;
  width: 450px;
  
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 550px; // 높이 조정
`;

// 입력 필드 스타일
const InputField = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #dccafc;
  border-radius: 20px;
  box-sizing: border-box;
  font-size: 16px;
    

   &:focus {
    border-color: #a16eff; /* 클릭 시 변경할 테두리 색상 */
    outline: none; /* 기본 파란색 아웃라인 제거 */
    box-shadow: 0 0 5px rgba(161, 110, 255, 0.5); /* 클릭 시 부드러운 그림자 효과 */
  }
`;

// 버튼 스타일
const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #5f53d3;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); // 쉐도우 추가

  &:hover {
    background-color: #dccafc;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); // Hover 시 쉐도우 강조
  }
`;


// 텍스트 버튼 스타일
const TextButtonContainer = styled.div`
  margin-top: 25px;
  display: flex;
  justify-content: space-between; /* Spread the buttons */
  align-items: center;
  width: 100%;
`;

const TextButton = styled.button`
  background: none;
  border: none;
  color: black;
  cursor: pointer;
  font-size: 12px; // Reduced font size
  text-decoration: underline;
  margin-right: 8px; // Space between 아이디 찾기 and 비밀번호 찾기

  &:hover {
    color: #c1c1c1;
  }
`;

const Slash = styled.span`
  margin-right: 8px;
  color: black;
  font-size: 12px; // Reduced font size
`;

const SignupTextButton = styled.button`
  background: none;
  border: none;
  color: black;
  cursor: pointer;
  font-size: 12px; // Reduced font size
  text-decoration: underline;

  &:hover {
    color: #c1c1c1;
  }
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: #ccc;
  margin: 20px 0;
`;

const SnsLoginText = styled.div`
  font-size: 14px;
  color: black;
  margin-bottom: 10px;
`;

const LoginModal = ({ closeModal, setIsLoggedIn }) => {
  const onSnsSignInButtonClickHandler = (type) => {
    window.location.href = SNS_SIGN_IN_URL(type);
  };
  const DOMAIN = 'http://localhost:8111'; // 도메인 수정
  const API_DOMAIN = `${DOMAIN}/api/v1`;
  const SNS_SIGN_IN_URL = (type) => `${API_DOMAIN}/auth/oauth2/${type}`;

  const [inputEmail, setInputEmail] = useState("");
  const [inputPw, setInputPw] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isFindIdModalOpen, setIsFindIdModalOpen] = useState(false);
  const [isFindPwModalOpen, setIsFindPwModalOpen] = useState(false);

  const handleInputChange = (e, setState) => {
    setState(e.target.value);
  };

  const onClickLogin = async () => {
    console.log("로그인!");
    try {
      const res = await AuthApi.login(inputEmail, inputPw);
      if (res.data.grantType === "Bearer") {
        console.log("accessToken : " + res.data.accessToken);
        console.log("refreshToken : " + res.data.refreshToken);
        Commons.setAccessToken(res.data.accessToken);
        Commons.setRefreshToken(res.data.refreshToken);
        setIsLoggedIn(true);
        closeModal();
      } else {
        setErrorMessage("이메일 또는 비밀번호를 확인하세요.");
      }
    } catch (err) {
      console.log("로그인 에러 : " + err);
      setErrorMessage("이메일 또는 비밀번호를 확인하세요."); // 모든 오류에 대해 동일한 메시지 출력
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") { 
      
      e.preventDefault(); // 엔터 키가 눌렸을 때
      onClickLogin();          // 로그인 버튼 클릭 함수 실행
    }
  };
  

  const openSignupModal = () => {
    setIsSignupModalOpen(true);
  };

  const closeSignupModal = () => {
    setIsSignupModalOpen(false);
  };

  const openFindIdModal = () => {
    setIsFindIdModalOpen(true);
  };

  const closeFindIdModal = () => {
    setIsFindIdModalOpen(false);
  };

  const openFindPwModal = () => {
    setIsFindPwModalOpen(true);
  };

  const closeFindPwModal = () => {
    setIsFindPwModalOpen(false);
  };

  return (
    <>
      <ModalOverlay onClick={closeModal} />
      <ModalContent>
        <h2>로그인</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <InputField
            type="text"
            placeholder="이메일"
            value={inputEmail}
            onChange={(e) => handleInputChange(e, setInputEmail)}
            onKeyDown={handleKeyPress}
          />
          <InputField
            type="password"
            placeholder="비밀번호"
            value={inputPw}
            onChange={(e) => handleInputChange(e, setInputPw)}
            onKeyDown={handleKeyPress}
          />
          <Button type="button" onClick={onClickLogin}>
            로그인
          </Button>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

          {/* 아이디찾기 / 비밀번호 찾기 */}
          <TextButtonContainer>
            <div>
              <TextButton onClick={openFindIdModal}>이메일 찾기</TextButton>
              <Slash>/</Slash>
              <TextButton onClick={openFindPwModal}>비밀번호 찾기</TextButton>
            </div>
            <SignupTextButton onClick={openSignupModal}>회원가입</SignupTextButton>
          </TextButtonContainer>

          {/* 라인 및 SNS 로그인 섹션 */}
          <Line />
          <SnsLoginText>SNS 계정 간편 로그인</SnsLoginText>
          <SocialButtonsContainer>
            <NaverButton onClick={() => onSnsSignInButtonClickHandler('naver')}>
              <LogoImg src={"https://firebasestorage.googleapis.com/v0/b/ipsi-f2028.firebasestorage.app/o/firebase%2Flogo%2Fnaver_logo.png?alt=media"}/>
              <p>네이버 로그인</p>
            </NaverButton>
            <KakaoButton onClick={() => onSnsSignInButtonClickHandler('kakao')}>
              <LogoImg src={"https://firebasestorage.googleapis.com/v0/b/ipsi-f2028.firebasestorage.app/o/firebase%2Flogo%2Fkakao_logo.png?alt=media"}/>
              <p>카카오 로그인</p>
            </KakaoButton>
          </SocialButtonsContainer>
        </form>
      </ModalContent>

      {isSignupModalOpen && <SignupModal closeModal={closeSignupModal} />}
      {isFindIdModalOpen && <FindIdByPhone closeModal={closeFindIdModal} />}
      {isFindPwModalOpen && <FindPw closeModal={closeFindPwModal} />}
    </>
  );
};

export default LoginModal;