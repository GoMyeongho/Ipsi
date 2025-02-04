import React, { useState, useEffect } from "react";
import styled from "styled-components";
import AuthApi from "../../../api/AuthApi"; // API 요청 함수

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  width: 450px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: auto;
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 20px;
  box-sizing: border-box;
  font-size: 16px;
  border: 1px solid #dccafc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  &:focus {
    border-color: #a16eff;
    outline: none;
    box-shadow: 0 0 4px rgba(161, 110, 255, 0.5);
  }
`;

const TimerText = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 5px;
`;

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

  &:hover {
    background-color: #dccafc;
  }

  &:disabled {
    background-color: #dccafc;
    cursor: not-allowed;
  }
`;

const MessageText = styled.p`
  color: ${(props) => (props.error ? "red" : "black")};
  margin-top: 10px;
`;

const FindPw = ({ closeModal }) => {
  const [inputEmail, setInputEmail] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0); // 5분 타이머 (초 단위)

  useEffect(() => {
    let timer;
    if (isCodeSent && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isCodeSent, countdown]);

  const handleSendVerificationCode = async () => {
    setIsSendingCode(true);
    try {
      const rsp = await AuthApi.emailCheck(inputEmail);
      if (rsp.data) {
        const emailResponse = await AuthApi.sendPw(inputEmail); // 인증번호 보내는 API
        if (emailResponse) {
          setIsCodeSent(true);
          setCountdown(300); // 5분 (300초) 타이머 시작
          setErrorMessage("");
        } else {
          setErrorMessage("인증번호 전송에 실패했습니다.");
        }
      } else {
        setErrorMessage("없는 사용자입니다.");
      }
    } catch (e) {
      console.error("오류 발생:", e);
      setErrorMessage("서버가 응답하지 않습니다.");
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      if (countdown === 0) {
        setErrorMessage("인증번호가 만료되었습니다. 다시 시도해주세요.");
        return;
      }

      const response = await AuthApi.verifyEmialToken(inputEmail, inputCode); // 인증번호 검증 API
      if (response === true) {
        setErrorMessage("");
        setIsCodeSent(false);
        // 비밀번호 재설정 로직 추가
      } else {
        setErrorMessage("잘못된 인증번호입니다.");
      }
    } catch (e) {
      console.error("오류 발생:", e);
      setErrorMessage("인증번호 확인에 실패했습니다.");
    }
  };

  const isEmailValid = inputEmail.includes("@");
  const formattedTime = `${Math.floor(countdown / 60)}:${String(countdown % 60).padStart(2, "0")}`;

  return (
    <ModalOverlay onClick={closeModal}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2>비밀번호 찾기</h2>
        <InputField
          type="email"
          placeholder="등록된 이메일을 입력하세요"
          value={inputEmail}
          onChange={(e) => setInputEmail(e.target.value)}
          disabled={isCodeSent}
        />
        <Button onClick={handleSendVerificationCode} disabled={!isEmailValid || isSendingCode}>
          {isSendingCode ? "인증번호 보내는 중..." : "인증번호 보내기"}
        </Button>
        {isSendingCode && <MessageText>인증번호 보내는 중...</MessageText>}
        {isCodeSent && (
          <>
            <InputField
              type="text"
              placeholder="인증번호 입력"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              disabled={countdown === 0}
            />
            {countdown > 0 ? (
              <TimerText>남은 시간: {formattedTime}</TimerText>
            ) : (
              <MessageText error>인증번호가 만료되었습니다. 다시 요청하세요.</MessageText>
            )}
            <Button onClick={handleVerifyCode} disabled={countdown === 0}>
              인증하기
            </Button>
            {countdown === 0 && (
              <Button onClick={handleSendVerificationCode}>인증번호 재전송</Button>
            )}
          </>
        )}
        {errorMessage && <MessageText error>{errorMessage}</MessageText>}
      </ModalContent>
    </ModalOverlay>
  );
};

export default FindPw;