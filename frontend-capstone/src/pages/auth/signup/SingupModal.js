import React, { useState } from "react";
import styled from "styled-components";
import AuthApi from "../../../api/AuthApi";

const SignupModal = ({ closeModal }) => {
  const [inputPhone, setInputPhone] = useState("");
  const [inputNickname, setInputNickname] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputPw, setInputPw] = useState("");
  const [inputConPw, setInputConPw] = useState("");
  const [inputEmail, setInputEmail] = useState("");

  const [isNickname, setIsNickname] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [isMail, setIsMail] = useState(false);
  const [isPw, setIsPw] = useState(false);
  const [isConPw, setIsConPw] = useState(false);
  const [isName, setIsName] = useState(false);

  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [inputVerificationCode, setInputVerificationCode] = useState("");
  const [showVerificationInput, setShowVerificationInput] = useState(false);

  const [nicknameMessage, setNicknameMessage] = useState("");
  const [pwMessage, setPwMessage] = useState("");
  const [conPwMessage, setConPwMessage] = useState("");
  const [mailMessage, setMailMessage] = useState("");
  const [phoneMessage, setPhoneMessage] = useState("");

  const [agreeTerms, setAgreeTerms] = useState({
    termsOfService: false,
    privacyPolicy: false,
    eventNotification: false,
  });

  const handleTermsChange = (term) => {
    setAgreeTerms((prev) => ({ ...prev, [term]: !prev[term] }));
  };

  const onClickSignup = async () => {
    try {

      const currentDate = new Date();
      const regDate = currentDate.toISOString(); 

      const memberReg = await AuthApi.signup(
        inputEmail,
        inputPw,
        inputName,
        inputPhone,
        regDate
      );
      if (memberReg.data) {
        alert("회원가입에 성공했습니다.");
        closeModal();
      } else {
        alert("회원가입에 실패했습니다.");
      }
    } catch (e) {
      alert("서버가 응답하지 않습니다.");
    }
  };

  const memberRegCheck = async (email) => {
    try {
      const resp = await AuthApi.isEmailExist(email);
      if (resp.data) {
        setMailMessage("사용 가능한 이메일 입니다.");
        setIsMail(true);
      } else {
        setMailMessage("중복된 이메일 입니다.");
        setIsMail(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeMail = (e) => {
    setInputEmail(e.target.value);
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(e.target.value)) {
      setMailMessage("이메일 형식이 올바르지 않습니다.");
      setIsMail(false);
    } else {
      setMailMessage("올바른 형식 입니다.");
      setIsMail(true);
      memberRegCheck(e.target.value);
    }
  };

  const onChangePw = (e) => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
    const passwordCurrent = e.target.value;
    setInputPw(passwordCurrent);
    if (!passwordRegex.test(passwordCurrent)) {
      setPwMessage("숫자+영문자+특수문자 조합으로 8자리 이상 입력해주세요!");
      setIsPw(false);
    } else {
      setPwMessage("안전한 비밀번호에요 ");
      setIsPw(true);
    }
  };

  const onChangeConPw = (e) => {
    const passwordCurrent = e.target.value;
    setInputConPw(passwordCurrent);
    if (passwordCurrent !== inputPw) {
      setConPwMessage("비밀번호가 일치하지 않습니다.");
      setIsConPw(false);
    } else {
      setConPwMessage("비밀번호가 일치합니다.");
      setIsConPw(true);
    }
  };

  const onVerifyCode = async () => {
    try {
      // 인증번호 검증을 위한 서버 API 호출
      const response = await AuthApi.verifyToken(inputEmail, inputVerificationCode);
  
      if (response === "토큰이 유효합니다.") {
        setPhoneVerified(true);
        alert("인증번호가 확인되었습니다.");
      } else {
        setPhoneVerified(false);
        alert("인증번호가 유효하지 않거나 만료되었습니다.");
      }
    } catch (error) {
      setPhoneVerified(false);
      alert("인증번호 확인 중 오류가 발생했습니다.");
    }
  };

  const onVerifySmsCode = async () => {
    try {
      // 인증번호 검증을 위한 서버 API 호출
      const response = await AuthApi.verifySmsToken(inputPhone, inputVerificationCode);
  
      if (response) {
        setPhoneVerified(true);
        alert("인증번호가 확인되었습니다.");
      } else {
        setPhoneVerified(false);
        alert("인증번호가 유효하지 않거나 만료되었습니다.");
      }
    } catch (error) {
      setPhoneVerified(false);
      alert("인증번호 확인 중 오류가 발생했습니다.");
    }
  };



  const onChangeNickname = async (e) => {
    const nicknameValue = e.target.value;
    setInputNickname(nicknameValue);

    if (nicknameValue.length < 5 || nicknameValue.length > 15) {
      setNicknameMessage("아이디는 5자 이상 15자 이하로 입력하세요.");
      setIsNickname(false);
      return;
    }

    try {
      const resp = await AuthApi.idCheck(nicknameValue);
      if (resp.data === true) {
        setNicknameMessage("사용 가능한 아이디입니다.");
        setIsNickname(true);
      } else {
        setNicknameMessage("중복된 아이디입니다.");
        setIsNickname(false);
      }
    } catch (error) {
      setNicknameMessage("아이디 중복 검사에 실패했습니다.");
      setIsNickname(false);
    }
  };

  const onChangePhone = (e) => {
    const phoneValue = e.target.value;
    setInputPhone(phoneValue);

    const phoneRegex = /^010\d{4}\d{4}$/;
    if (!phoneRegex.test(phoneValue)) {
      setPhoneMessage("전화번호 형식이 올바르지 않습니다.");
      setIsPhone(false);
    } else {
      setPhoneMessage("올바른 전화번호입니다.");
      setIsPhone(true);
    }
  };

  let isRequestInProgress = false; // 중복 요청 방지 플래그

  const onClickPhoneVerify = async () => {
    if (isRequestInProgress) return; // 중복 요청 방지
    isRequestInProgress = true;
  
    if (isPhone) {
      try {
        const resp = await AuthApi.sendVerificationCode(inputPhone);
        if (resp.data) {
          setVerificationCode(resp.data.verificationCode);
          setShowVerificationInput(true);
          alert("인증번호가 발송되었습니다.");
        } else {
          alert("인증번호 발송에 실패했습니다2.");
        }
      } catch (error) {
        alert("서버 오류로 인증번호 발송에 실패했습니다.");
      } finally {
        isRequestInProgress = false; // 요청 완료 후 플래그 초기화
      }
    }
  };
  
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const onChangeName = (e) => {
    setInputName(e.target.value);
    setIsName(true);
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer>
        <h3>회원가입</h3>

        {/* <InputContainer>
          <p>닉네임</p>
          <Input
            type="text"
            placeholder="닉네임을 입력해주세요"
            value={inputNickname}
            onChange={onChangeNickname}
          />
          {nicknameMessage && <Message isValid={isNickname}>{nicknameMessage}</Message>}
        </InputContainer> */}
        <InputContainer>
          <p>이메일</p>
          <Input
            type="email"
            placeholder="이메일 주소 입력 "
            value={inputEmail}
            onChange={onChangeMail}
          />
          {mailMessage && <Message isValid={isMail}>{mailMessage}</Message>}
        </InputContainer>
        <InputContainer>
          <p>비밀번호</p>
          <Input
            type="password"
            placeholder="비밀번호 입력(숫자, 영문자, 특수문자 포함 8~25)"
            value={inputPw}
            onChange={onChangePw}
          />
          {pwMessage && <Message isValid={isPw}>{pwMessage}</Message>}
        </InputContainer>
        <InputContainer>
          <p>비밀번호 확인</p>
          <Input
            type="password"
            placeholder="비밀번호 재입력"
            value={inputConPw}
            onChange={onChangeConPw}
          />
          {conPwMessage && <Message isValid={isConPw}>{conPwMessage}</Message>}
        </InputContainer>
        <InputContainer>
          <p>이름</p>
          <Input
            type="text"
            placeholder="이름을 입력해주세요"
            value={inputName}
            onChange={onChangeName}
          />
        </InputContainer>

        {/* 전화번호 입력 및 인증 */}
        <InputContainer>
  <p>전화번호</p>
  <div style={{ display: "flex", alignItems: "center", width: "415px" }}>
    <Input
      type="text"
      placeholder="전화번호 -(하이픈) 포함 13자리 입력"
      value={inputPhone}
      onChange={onChangePhone}
      style={{ flex: "1", marginRight: "10px", width: "calc(100% - 100px)" }} // 버튼 크기 제외한 공간 차지
    />
  <PhoneVerifyButton
  onClick={onClickPhoneVerify}
  disabled={!isPhone || !agreeTerms.termsOfService || !agreeTerms.privacyPolicy} // 전화번호와 약관 동의가 체크되어야만 활성화
  style={{ width: "90px" }} // 버튼 크기 설정
>
  인증하기1
</PhoneVerifyButton>
  </div>
  {phoneMessage && <Message isValid={isPhone}>{phoneMessage}</Message>}
</InputContainer>

        {/* 인증번호 입력 */}
        {showVerificationInput && (
          <InputContainer>
            <p>인증번호</p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Input
                type="text"
                placeholder="인증번호 입력"
                value={inputVerificationCode}
                onChange={(e) => setInputVerificationCode(e.target.value)}
                style={{ flex: "1", marginRight: "10px" }}
              />
              <PhoneVerifyButton onClick={onVerifySmsCode}>
                인증요청
              </PhoneVerifyButton>
            </div>
          </InputContainer>
        )}

        {/* 약관 동의 UI */}
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <h4>약관 동의</h4>
          <div>
            <input
              type="checkbox"
              checked={agreeTerms.termsOfService}
              onChange={() => handleTermsChange('termsOfService')}
            />
            <label>[필수] 서비스 이용약관에 동의합니다.</label>
            <p style={{ fontSize: '12px', color: '#555' }}>
              (여기에 서비스 이용약관 세부 내용을 추가하세요.)
            </p>
          </div>
          <div>
            <input
              type="checkbox"
              checked={agreeTerms.privacyPolicy}
              onChange={() => handleTermsChange('privacyPolicy')}
            />
            <label>[필수] 개인정보 처리방침에 동의합니다.</label>
            <p style={{ fontSize: '12px', color: '#555' }}>
              (여기에 개인정보 처리방침 세부 내용을 추가하세요.)
            </p>
          </div>
          <div>
            <input
              type="checkbox"
              checked={agreeTerms.eventNotification}
              onChange={() => handleTermsChange('eventNotification')}
            />
            <label>[선택] 이벤트 알림 수신에 동의합니다.</label>
            <p style={{ fontSize: '12px', color: '#555' }}>
              (이벤트 및 프로모션 알림 관련 세부 내용을 추가하세요.)
            </p>
          </div>
        </div>

        {/* 가입 버튼 */}
        <ButtonContainer>
          <SignupButton
            disabled={
              !isName ||
              !isPw ||
              !isConPw ||
              !isMail ||
              !isPhone ||
              !phoneVerified ||
              !agreeTerms.termsOfService ||
              !agreeTerms.privacyPolicy
            }
            onClick={onClickSignup}
          >
            가입하기
          </SignupButton>
        </ButtonContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default SignupModal;


// 스타일 코드들 (여기에 그대로 두시면 됩니다)
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const ModalContainer = styled.div`
  border-radius: 25px;
  z-index: 1000;
  background-color: white;
  padding: 20px;
  width: 600px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputContainer = styled.div`
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const Input = styled.input`
  width: 415px;
  padding: 9px;
  margin-bottom: 4px;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 16px;
  box-sizing: border-box;
  background-color: white;
  color: black;
  outline: none;
  &:focus {
    border-color: black;
  }
`;

const PhoneVerifyButton = styled.button`
  width: 200px;
  padding: 9px;
  font-size: 16px;
  color: white;
  background-color: ${({ disabled }) => (disabled ? "#ccc" : "black")};
  border: none;
  border-radius: 20px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  &:hover {
    background-color: ${({ disabled }) => (disabled ? "#ccc" : "#333")};
  }
`;

const Message = styled.div`
  color: red;
  font-size: 11px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const SignupButton = styled.button`
  padding: 15px 30px;
  font-size: 16px;
  color: white;
  background-color: ${({ disabled }) => (disabled ? "#ccc" : "black")};
  border: none;
  border-radius: 20px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  width: 415px;
  &:hover {
    background-color: ${({ disabled }) => (disabled ? "#ccc" : "#333")};
  }
`;

const TermsContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;

  label {
    display: flex;
    align-items: center;
    color: #333;
  }

  input[type="checkbox"] {
    margin-right: 10px;
  }
`;