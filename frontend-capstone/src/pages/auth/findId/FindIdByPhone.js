import React, { useState } from "react";
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
`;

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

  &:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
  }
`;

const MessageText = styled.p`
  color: ${(props) => (props.error ? "red" : "black")};
  margin-top: 10px;
`;

const SuccessModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10001;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  width: 350px;
  border-radius: 10px;
  text-align: center;
`;

const FindIdByPhone = ({ closeModal }) => {
  const [phone, setPhone] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSendVerificationCode = async () => {
    try {
      const response = await AuthApi.sendVerificationCode(phone);
      if (response) {
        setIsCodeSent(true);
        setErrorMessage("");
      } else {
        setErrorMessage("인증번호 발송에 실패했습니다.");
      }
    } catch (error) {
      setErrorMessage("서버에서 오류가 발생했습니다.");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await AuthApi.verifySmsToken(phone, inputCode);
  
      if (response) {
        const rsp = await AuthApi.findPhoneByEmail(phone);
        const fullEmail = rsp.data; // 전체 이메일 주소
        const [localPart, domainPart] = fullEmail.split("@"); // 이메일을 @로 분리
        const maskedEmail =
          localPart.length > 3
            ? localPart.substring(0, 3) + "*".repeat(localPart.length - 3) + "@" + domainPart
            : localPart + "@" + domainPart; // 앞 3글자만 표시하고 나머지는 *로 대체
        setEmail(maskedEmail); // 가공된 이메일 저장
        setErrorMessage("");
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("이메일 찾기 실패:", error);
      setErrorMessage("입력하신 번호로 이메일을 찾을 수 없습니다.");
    }
  };

  const handleModalClose = () => {
    closeModal();
  };

  const isPhoneValid = phone.length >= 11 && phone.length <= 12;

  return (
    <>
      {showSuccessModal ? (
        <SuccessModal onClick={closeModal}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <p>찾으신 이메일: {email}</p>
          </ModalContainer>
        </SuccessModal>
      ) : (
        <ModalOverlay onClick={handleModalClose}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h2>이메일 찾기</h2>
            <InputField
              type="text"
              placeholder="휴대폰 번호 입력"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Button onClick={handleSendVerificationCode} disabled={!isPhoneValid}>
              인증번호 보내기
            </Button>
            {isCodeSent && (
              <>
                <InputField
                  type="text"
                  placeholder="인증번호 입력"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                />
                <Button onClick={handleVerifyCode}>인증하기</Button>
              </>
            )}
            {errorMessage && (
              <MessageText error={!!errorMessage}>{errorMessage}</MessageText>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default FindIdByPhone;
