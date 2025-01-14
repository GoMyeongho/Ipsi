import React, { useState } from "react";
import styled from "styled-components";
import AxiosApi from "../../../api/AxiosApi";// Assume you have a function for API requests

const FindPw = ({ closeModal }) => {
  const [inputId, setInputId] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (e, setState) => {
    setState(e.target.value);
  };

  const generateTemporaryPassword = () => {
    const specialChars = "!@#$%^&*";
    const randomChar = specialChars.charAt(Math.floor(Math.random() * specialChars.length));
    let password = Math.random().toString(36).slice(-7);
    const randomIndex = Math.floor(Math.random() * (password.length + 1));
    password = password.slice(0, randomIndex) + randomChar + password.slice(randomIndex);

    return password;
  };

  const onClickFindPw = async () => {
    console.log("입력된 아이디:", inputId);
    console.log("입력된 이메일:", inputEmail);

    try {
      const rsp = await AxiosApi.checkIdMail(inputId, inputEmail);
      console.log("응답 데이터:", rsp);

      if (rsp.data) {
        const temporaryPassword = generateTemporaryPassword();
        const emailResponse = await AxiosApi.sendPw(inputId, inputEmail, temporaryPassword);
        if (emailResponse) {
          setErrorMessage(""); 
          setShowSuccessModal(true);
          setTimeout(() => {
            closeModal();
            setShowSuccessModal(false);
          }, 2000);
        } else {
          setErrorMessage("이메일 전송에 실패했습니다.");
        }
      } else {
        setErrorMessage("없는 사용자입니다.");
      }
    } catch (e) {
      console.error("오류 발생:", e);
      setErrorMessage("서버가 응답하지 않습니다.");
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <>
      {showSuccessModal ? (
        <SuccessModal>
          <ModalContainer>
            <p>임시 비밀번호가 등록된 이메일로 전송되었습니다.</p>
          </ModalContainer>
        </SuccessModal>
      ) : (
        <ModalOverlay onClick={handleOverlayClick}>
          <ModalContainer>
            <ModalHeader>
              <h2>비밀번호 찾기</h2>
            </ModalHeader>
            <ModalBody>
              <InputContainer>
                <label>아이디</label>
                <input
                  type="text"
                  value={inputId}
                  onChange={(e) => handleInputChange(e, setInputId)}
                  placeholder="아이디를 입력하세요"
                />
              </InputContainer>
              <InputContainer>
                <label>이메일</label>
                <input
                  type="email"
                  value={inputEmail}
                  onChange={(e) => handleInputChange(e, setInputEmail)}
                  placeholder="등록된 이메일을 입력하세요"
                />
              </InputContainer>
              {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
              <Button onClick={onClickFindPw}>임시 비밀번호 전송</Button>
            </ModalBody>
          </ModalContainer>
        </ModalOverlay>
      )}
    </>
  );
};

// 스타일링
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

const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  width: 450px;
  flex-direction: column;
  height: 380px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 10000;
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

const ModalHeader = styled.div`
  display: flex;
  justify-content: center;  // Centering the header
  align-items: center;
  margin-bottom: 20px;  // Removed border-bottom
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputContainer = styled.div`
  margin-bottom: 15px;

  label {
    font-size: 14px;
    color: #333;
    margin-bottom: 5px;
    display: block;
  }

  input {
    border-radius: 20px;
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    font-size: 16px;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  margin-top: 20px;
  background-color: black;
  color: white;
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c1c1c1;
  }
`;

export default FindPw;