  import React, { useState } from "react";
  import styled from "styled-components";
  import AuthApi from "../../../api/AuthApi"; // API 요청 함수

  import PasswordModal from "./PasswordModal";

  const FindPw = ({ closeModal }) => {
    const [inputEmail, setInputEmail] = useState("");
    const [inputCode, setInputCode] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    const [isPasswordModal, setPasswordModal] = useState(false);

    const handleInputChange = (e, setState) => {
      setState(e.target.value);
    };

    const closePasswrodModal = () => {
      setPasswordModal(false);
    };

    // 인증번호 보내기
    const sendVerificationCode = async () => {
      try {
        const rsp = await AuthApi.emailCheck(inputEmail);
        console.log(rsp)
        if (rsp.data) {
          const emailResponse = await AuthApi.sendPw(inputEmail); // 인증번호 보내는 API
          if (emailResponse) {
            setErrorMessage("");
            setIsCodeSent(true);
          } else {
            setErrorMessage("인증번호 전송에 실패했습니다.");
          }
        } else {
          setErrorMessage("없는 사용자입니다.");
        }
      } catch (e) {
        console.error("오류 발생:", e);
        setErrorMessage("서버가 응답하지 않습니다.");
      }
    };

    // 인증번호 확인
    const verifyEmialToken = async () => {
    
      try {
        const response = await AuthApi.verifyEmialToken(inputEmail, inputCode); // 인증번호 검증 API
        if (response===true) {
          // 인증번호가 맞으면 이메일 전달하여 비밀번호 수정 모달 열기
          setIsCodeSent(false);
       
          setPasswordModal(true);
          }

         else {
          setErrorMessage("잘못된 인증번호입니다.");
        }
      } catch (e) {
        console.error("오류 발생:", e);
        setErrorMessage("인증번호 확인에 실패했습니다.");
      }
    };
    const handleOverlayClick = (e) => {
      if (e.target === e.currentTarget) {
        closeModal();
      }
    };

    return (
      <>
          <ModalOverlay onClick={handleOverlayClick}>
            <ModalContainer>
              <ModalHeader>
                <h2>비밀번호 찾기</h2>
              </ModalHeader>
              <ModalBody>
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
                <Button onClick={sendVerificationCode}>인증번호 보내기</Button>

                {isCodeSent && (
                  <>
                    <InputContainer>
                      <label>인증번호</label>
                      <input
                        type="text"
                        value={inputCode}
                        onChange={(e) => handleInputChange(e, setInputCode)}
                        placeholder="인증번호를 입력하세요"
                      />
                    </InputContainer>
                    <Button onClick={verifyEmialToken}>인증하기</Button>
                  </>
                )}
              </ModalBody>
            </ModalContainer>
          </ModalOverlay>
          {isPasswordModal && <PasswordModal closeModal={closePasswrodModal} />}
      
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
