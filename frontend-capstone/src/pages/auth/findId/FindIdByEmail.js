import React, { useState } from "react";
import styled from "styled-components";
import AxiosApi from "../../../api/AxiosApi";// Assume you have a function for API requests

// 모달 배경
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

// 아이디 찾기 모달 콘텐츠
const ModalContent = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  width: 450px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 380px;
`;

// 텍스트 스타일
const MessageText = styled.p`
  color: ${(props) => (props.error ? "red" : "black")};
  margin-top: 10px;
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
`;

// 성공 모달 배경 (더 작은 크기)
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

// 성공 모달 내용 (아이디 찾기 모달보다 작은 크기)
const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  width: 350px;  /* Smaller width */
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const FindIdByEmail = ({ closeModal }) => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal
  const [userId, setUserId] = useState(""); // To store the found user ID

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleFindId = async () => {
    if (!email) {
      setErrorMessage("이메일을 입력해주세요.");
      return;
    }

    try {
      // 이메일을 서버로 보내서 아이디를 찾는 API 호출
      const response = await AxiosApi.findIdByEmail(email);

      if (response.data.success) {
        // 아이디가 존재하면
        setUserId(response.data.userId); // Store the userId to display in the modal
        setShowSuccessModal(true); // Show the success modal
        setErrorMessage(""); // Clear error message if successful
      } else {
        // 아이디를 찾을 수 없는 경우
        setErrorMessage("입력하신 이메일에 해당하는 아이디가 없습니다.");
      }
    } catch (error) {
      setErrorMessage("서버에서 오류가 발생했습니다.");
    }
  };

  // Function to handle clicks on the overlay, close the modal when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSuccessModal(false); // Close the success modal when clicking outside
      closeModal();
      }
  };

  // Function to prevent closing the modal when clicking inside the modal content
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      {showSuccessModal ? (
        <SuccessModal onClick={handleOverlayClick} >
          <ModalContainer>
            <p>아이디: {userId}</p> {/* Display the found user ID in the modal */}
          </ModalContainer>
        </SuccessModal>
      ) : (
        <ModalOverlay onClick={handleOverlayClick}>
          <ModalContent onClick={handleModalContentClick}>
            <h2>아이디 찾기</h2>
            <InputField
              type="email"
              placeholder="이메일 입력"
              value={email}
              onChange={handleInputChange}
            />
            <Button onClick={handleFindId}>아이디 찾기</Button>
            {errorMessage && <MessageText error>{errorMessage}</MessageText>}
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

// 스타일링
const InputField = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 20px;
  box-sizing: border-box;
  font-size: 16px;
`;

export default FindIdByEmail;
 