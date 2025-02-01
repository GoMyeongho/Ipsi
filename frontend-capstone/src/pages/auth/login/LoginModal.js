import React, {useContext, useState} from "react";
import styled from "styled-components";
import AuthApi from "../../../api/AuthApi";
import SignupModal from "../signup/SingupModal";
import FindPw from "../findPw/FIndPw";
import FindIdByPhone from "../findId/FindIdByPhone";
import { useNavigate } from "react-router-dom";
import Commons from "../../../util/Common";
import {useDispatch} from "react-redux";
import {setAccessToken, setRefreshToken} from "../../../context/redux/PersistentReducer";
import RejectModal from "../../../component/Modal/RejectModal";


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

const NaverButton = styled.button`
  width: 100%;
  height: 45px;
  background-image: url("https://firebasestorage.googleapis.com/v0/b/ipsi-f2028.firebasestorage.app/o/firebase%2Flogo%2FbtnG_완성형.png?alt=media");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    opacity: 0.9;
  }
`;

const KakaoButton = styled.button`
  width: 100%;
  height: 45px;
  background-image: url("https://firebasestorage.googleapis.com/v0/b/ipsi-f2028.firebasestorage.app/o/firebase%2Flogo%2Fkakao_login_large_wide.png?alt=media");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    opacity: 0.9;
  }
`;

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
  height: 450px; // 높이 조정
`;

// 입력 필드 스타일
const InputField = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 20px;
  box-sizing: border-box;
  font-size: 16px;
`;

// 버튼 스타일
const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;

  &:hover {
    background-color: #c1c1c1;
  }
`;

// 텍스트 버튼 스타일
const TextButtonContainer = styled.div`
  margin-top: 10px;
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

const LoginModal = ({ closeModal }) => {
  const dispatch = useDispatch();
  const onSnsSignInButtonClickHandler =(type) =>{
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
  const [reject, setReject] = useState({});
  
  // 로그인시 MainPage 이동(로그인시 자료구매현황을 확인해서 구매한자료인지 아닌지 파악하기위함)
  const navigate = useNavigate();

  const handleInputChange = (e, setState) => {
    setState(e.target.value);
  };
 
  const onClickLogin = async () => {
    console.log("로그인!");
    try {
      const res = await AuthApi.login(inputEmail, inputPw);
      // console.log(res.data);
      if (res.data.grantType === "Bearer") {
        console.log("accessToken : " + res.data.accessToken);
        console.log("refreshToken : " + res.data.refreshToken);
        dispatch(setAccessToken(res.data.accessToken));
        dispatch(setRefreshToken(res.data.refreshToken));
        closeModal();
      } else {
        console.log("잘못된 아이디 또는 비밀번호 입니다.");
        setReject({message : "ID와 PW가 다릅니다.", active: true});
      }
    } catch (err) {
      console.log("로그인 에러 : " + err);
      if (err.response && err.response.status === 405) {
        console.log("로그인 실패: 405 Unauthorized");
        setReject({message : "로그인에 실패하였습니다.", active: true});
      } else {
        console.log("로그인 에러 : " + err);
        setReject({message : "서버와의 통신에 실패했습니다.", active: true});
      }
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
            placeholder="아이디"
            value={inputEmail}
            onChange={(e) => handleInputChange(e, setInputEmail)}
          />
          <InputField
            type="password"
            placeholder="패스워드"
            value={inputPw}
            onChange={(e) => handleInputChange(e, setInputPw)}
          />
          <Button type="button" onClick={onClickLogin}>
            로그인
          </Button>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

          {/* 네이버 및 카카오톡 로그인 버튼 */}
          <SocialButtonsContainer>
            <NaverButton onClick={() => onSnsSignInButtonClickHandler('naver')}></NaverButton>
            <KakaoButton onClick={() => onSnsSignInButtonClickHandler('kakao')}></KakaoButton>
          </SocialButtonsContainer>

          {/* 아이디찾기 / 비밀번호 찾기 */}
          <TextButtonContainer>
            <div>
              <TextButton onClick={openFindIdModal}>아이디 찾기</TextButton>
              <Slash>/</Slash>
              <TextButton onClick={openFindPwModal}>비밀번호 찾기</TextButton>
            </div>
            <SignupTextButton onClick={openSignupModal}>회원가입</SignupTextButton>
          </TextButtonContainer>
        </form>
      </ModalContent>

      {isSignupModalOpen && <SignupModal closeModal={closeSignupModal} />}
      {isFindIdModalOpen && <FindIdByPhone closeModal={closeFindIdModal} />}
      {isFindPwModalOpen && <FindPw closeModal={closeFindPwModal} />}
      <RejectModal open={reject.active} message={reject.message} onClose={() => setReject("")}></RejectModal>
    </>
  );
};

export default LoginModal;
