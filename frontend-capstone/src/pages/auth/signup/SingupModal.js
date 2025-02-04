import React, { useState, useEffect } from "react";
import styled from "styled-components";
import AuthApi from "../../../api/AuthApi";
import TermsModal from "./TermsModal";

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");

  const openTermsModal = (title, content) => {
    setModalTitle(title);
    setModalContent(content);
    setIsModalOpen(true);
  };

  const [timeLeft, setTimeLeft] = useState(300); // 5분 (300초)
const [timerActive, setTimerActive] = useState(false);

// 인증번호 입력창이 뜰 때 타이머 시작
useEffect(() => {
  if (showVerificationInput) {
    setTimeLeft(300); // 5분 설정
    setTimerActive(true);
  }
}, [showVerificationInput]);

useEffect(() => {
  if (timerActive && timeLeft > 0) {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  } else if (timeLeft === 0) {
    setTimerActive(false);
    alert("인증 시간이 만료되었습니다. 다시 요청해주세요.");
  }
}, [timerActive, timeLeft]);

// 남은 시간을 MM:SS 형식으로 변환
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};





  const handleTermsChange = (term) => {
    setAgreeTerms((prev) => ({ ...prev, [term]: !prev[term] }));
  };

  const onClickSignup = async () => {
    try {

      const currentDate = new Date();
      const regDate = currentDate.toISOString(); 

      const memberReg = await AuthApi.signup(
        inputNickname,
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
    const nickNameValue = e.target.value;
    setInputNickname(nickNameValue);

    if (nickNameValue.length < 3 || nickNameValue.length > 10) {
      setNicknameMessage("닉네임은 3자 이상 10자 이하로 입력하세요.");
      setIsNickname(false);
      return;
    }

    try {
      const resp = await AuthApi.nickNameCheck(nickNameValue);
      if (resp.data === false) {
        setNicknameMessage("사용 가능한 닉네임입니다.");
        setIsNickname(true);
      } else {
        setNicknameMessage("중복된 닉네임입니다.");
        setIsNickname(false);
      }
    } catch (error) {
      setNicknameMessage("닉네임 중복 검사에 실패했습니다.");
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
  const closeTermsModal = () => {
    setIsModalOpen(false);
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

        <InputContainer>
          <p>닉네임</p>
          <Input
            type="text"
            placeholder="닉네임을 입력해주세요"
            value={inputNickname}
            onChange={onChangeNickname}
          />
          {nicknameMessage && <Message isValid={isNickname}>{nicknameMessage}</Message>}
        </InputContainer>
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
          <br></br>
        {/* 전화번호 입력 및 인증 */}
        <InputContainer>
  <p>전화번호</p>
  <div style={{ display: "flex", alignItems: "center", width: "415px" }}>
    <Input
      type="text"
      placeholder="전화번호 13자리 입력"
      value={inputPhone}
      onChange={onChangePhone}
      style={{ flex: "1", marginRight: "10px", width: "calc(100% - 100px)" }} // 버튼 크기 제외한 공간 차지
    />
    <PhoneVerifyButton
      onClick={onClickPhoneVerify}
      disabled={!isPhone || !agreeTerms.termsOfService || !agreeTerms.privacyPolicy} // 전화번호와 약관 동의가 체크되어야만 활성화
      style={{ width: "90px" }} // 버튼 크기 설정
    >
      인증요청
    </PhoneVerifyButton>
  </div>
  {phoneMessage && <Message isValid={isPhone}>{phoneMessage}</Message>}
</InputContainer>

{/* 인증번호 입력 */}
{showVerificationInput && (
      <InputContainer>
        <p>인증번호</p>
        <div style={{ display: "flex", alignItems: "center", width: "415px" }}>
          <Input
            type="text"
            placeholder="인증번호 입력"
            value={inputVerificationCode}
            onChange={(e) => setInputVerificationCode(e.target.value)}
            style={{ flex: "1", marginRight: "10px", width: "calc(100% - 100px)" }}
          />
          <PhoneVerifyButton
            onClick={onVerifySmsCode}
            style={{ width: "90px" }}
            disabled={timeLeft === 0} // 시간이 만료되면 버튼 비활성화
          >
            인증하기
          </PhoneVerifyButton>
        </div>
        <p style={{ marginTop: "5px", color: timeLeft < 60 ? "red" : "black" }}>
          남은 시간: {formatTime(timeLeft)}
        </p>
      </InputContainer>
)}
        {/* 약관 동의 UI */}
       
        <TermsHeader>약관 동의</TermsHeader>
        <TermsWrapper>

        <TermContainer>
  <TermsCheckbox
    type="checkbox"
    checked={agreeTerms.termsOfService}
    onChange={() => handleTermsChange('termsOfService')}
  />
  <TermLabel>
    [필수]{" "}
    <TermLink onClick={() => openTermsModal("UniGuide 서비스 이용약관", termsOfService)}>
  서비스 이용약관
</TermLink>
    에 동의합니다.
  </TermLabel>
</TermContainer>
<TermContainer>
  <TermsCheckbox
    type="checkbox"
    checked={agreeTerms.privacyPolicy}
    onChange={() => handleTermsChange('privacyPolicy')}
  />
  <TermLabel>
    [필수]{" "}
    <TermLink onClick={() => openTermsModal("개인정보 처리방침", privacyPolicy)}>
  개인정보 처리방침
</TermLink>
    에 동의합니다.
  </TermLabel>
</TermContainer>
</TermsWrapper>
<TermsModal isOpen={isModalOpen} title={modalTitle} content={modalContent} onClose={closeTermsModal} />


{/* 가입 버튼 */}
<ButtonContainer>
  <SignupButton
    disabled={
      !isNickname || 
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
  background-color: ${({ theme }) => theme.background || "white"};
  padding: 20px;
  width: 600px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
 
`;

const InputContainer = styled.div`
  margin-bottom: 5px;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const Input = styled.input`
  width: 415px;
  padding: 9px;
  margin-bottom: 2px;
  border: 1px solid ${({ theme }) => theme.border || "#dccafc"};
  border-radius: 15px;
  font-size: 16px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.inputBackground || "white"};
  color: ${({ theme }) => theme.inputTextColor || "black"};
  outline: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); // 쉐도우 추가
  &:focus {
    border-color: #a16eff; /* 클릭 시 변경할 테두리 색상 */
    outline: none; /* 기본 파란색 아웃라인 제거 */
    box-shadow: 0 0 5px rgba(161, 110, 255, 0.5); /* 클릭 시 부드러운 그림자 효과 */
  }
  &::placeholder {
    font-size: 12px;  /* placeholder 텍스트 크기 줄이기 */
    color: ${({ theme }) => theme.placeholderColor || "#aaa"};  /* placeholder 텍스트 색상 */
  }
`;

const PhoneVerifyButton = styled.button`
  width: 200px;
  padding: 9px;
  font-size: 16px;
  color: ${({ theme }) => theme.buttonTextColor || "white"};
  background-color: ${({ disabled, theme }) => (disabled ? theme.disabledButton || "#dccafc" : theme.buttonBackground || "#5f53d3")};
  border: none;
  border-radius: 20px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  &:hover {
    background-color: ${({ disabled, theme }) => (disabled ? theme.disabledButtonHover || "#dccafc" : theme.buttonHover || "#5f53d3")};
  }
`;

const Message = styled.p`
  color: ${(props) => (props.isValid ? (props.theme.validMessage || 'green') : (props.theme.invalidMessage || 'red'))}; /* 메시지 색상 */
  text-align: right;
  font-size: 13px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
   margin-top: 30px; // 가입하기 버튼과 약관 동의 사이의 간격을 넓힘
`;

const SignupButton = styled.button`
  padding: 15px 30px;
  font-size: 16px;
  color: ${({ theme }) => theme.buttonTextColor || "white"};
  background-color: ${({ disabled, theme }) => (disabled ? theme.disabledButton || "#5f53d3" : theme.buttonBackground || "#dccafc")};
  border: none;
  border-radius: 20px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  width: 415px;
  &:hover {
    background-color: ${({ disabled, theme }) => (disabled ? theme.disabledButtonHover || "#5f53d3" : theme.buttonHover || "#dccafc")};
  }
`;

const TermsWrapper = styled.div`
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #5f53d3;
  border-radius: 15px;
  width: 415px;
  text-align: left; // 왼쪽 정렬
`;

const TermsHeader = styled.h4`
  color: #5f53d3;
  text-align: left; // 왼쪽 정렬
`;

const TermContainer = styled.div`
  display: flex;
  align-items: center; /* 체크박스와 텍스트 세로 중앙 정렬 */
  margin-bottom: 6px;
  gap: 8px; /* 체크박스와 텍스트 사이의 간격 */
`;

const TermLabel = styled.label`
  color: #333;
  font-size: 14px;
  margin-left: 8px; /* 텍스트와 체크박스 사이의 간격 */
`;


const TermLink = styled.span`
  color: blue;
  cursor: pointer;
  text-decoration: underline;
`;

const CloseButton = styled.button`
  padding: 10px 20px;
  background-color: #5f53d3;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
`;


const TermsCheckbox = styled.input`
  appearance: none; /* 기본 브라우저 스타일 제거 */
  width: 16px;
  height: 16px;
  border: 2px solid #5f53d3; /* 체크박스 테두리 */
  border-radius: 4px;
  position: relative;
  cursor: pointer;
  
  &:checked {
    background-color: #5f53d3; /* 체크되었을 때 배경색 */
    border-color: #5f53d3;
  }

  &:checked::before {
    content: "✔"; /* 체크 표시 */
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: white; /* 체크 표시 색 */
    font-size: 12px;
    font-weight: bold;
  }
`;

const TermsContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  width: 415px;
  padding: 10px;
  border: 1px solid #5f53d3;
  border-radius: 15px;
  background-color: ${({ theme }) => theme.inputBackground || "white"};
`;


const termsOfService = `
**UniGuide 서비스 이용약관**

제 1 조 (목적)  
본 약관은 UniGuide(이하 "회사")가 제공하는 온라인 자기소개서 거래 플랫폼(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제 2 조 (정의)  
1. "서비스"란 회사가 제공하는 자기소개서 판매 및 구매 관련 플랫폼과 관련된 모든 서비스를 의미합니다.  
2. "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 의미합니다.  
3. "회원"이란 회사에 회원 등록을 한 자로서, 지속적으로 서비스를 이용할 수 있는 자를 의미합니다.  
4. "비회원"이란 회원에 가입하지 않고 서비스를 이용하는 자를 의미합니다.  
5. "콘텐츠"란 이용자가 서비스 내에서 제공하는 자기소개서, 리뷰, 기타 게시물을 의미합니다.  

제 3 조 (약관의 효력 및 변경)  
1. 본 약관은 이용자가 서비스 이용을 신청함과 동시에 효력이 발생합니다.  
2. 회사는 필요 시 약관을 개정할 수 있으며, 변경된 약관은 적용일자 7일 전부터 공지합니다.  
3. 이용자는 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단할 수 있으며, 계속 이용하는 경우 변경된 약관에 동의한 것으로 간주됩니다.  

제 4 조 (서비스의 제공 및 변경)  
1. 회사는 이용자에게 다음과 같은 서비스를 제공합니다.  
   1) 자기소개서 등록 및 거래  
   2) 자기소개서 검색 및 열람  
   3) 기타 회사가 제공하는 관련 서비스  
2. 회사는 운영상 또는 기술상의 필요에 따라 서비스 내용을 변경할 수 있으며, 변경된 사항은 사전에 공지합니다.  

제 5 조 (이용자의 의무)  
1. 이용자는 본 약관을 준수하며, 다음 행위를 해서는 안 됩니다.  
   1) 타인의 개인정보 도용  
   2) 허위 정보 등록  
   3) 불법적인 콘텐츠 게시 또는 거래  
   4) 기타 법령 및 공서양속에 반하는 행위  
2. 이용자는 회사가 정한 절차에 따라 서비스 이용에 필요한 정보를 제공해야 합니다.  

제 6 조 (계약 해지 및 이용제한)  
1. 이용자는 언제든지 회사에 서비스 이용 해지를 요청할 수 있습니다.  
2. 회사는 이용자가 약관을 위반하거나 불법 행위를 하는 경우 사전 통보 없이 이용을 제한할 수 있습니다.  

제 7 조 (책임의 한계)  
1. 회사는 플랫폼 제공자로서 거래 당사자가 아니며, 이용자가 등록한 콘텐츠의 정확성, 신뢰성 등에 대해 책임지지 않습니다.  
2. 회사는 천재지변, 시스템 장애 등 불가항력적인 사유로 인한 서비스 중단에 대해 책임지지 않습니다.  
`;
const privacyPolicy = `
**UniGuide 개인정보 처리방침**

제 1 조 (개인정보의 수집 및 이용 목적)
회사는 다음과 같은 목적으로 이용자의 개인정보를 수집하고 이용합니다.

1. 회원가입 및 관리: 가입 의사 확인, 본인 인증, 회원 서비스 제공
2. 거래 지원: 자기소개서 등록, 구매, 결제 처리
3. 서비스 개선: 고객 문의 대응, 서비스 이용 통계 분석

제 2 조 (수집하는 개인정보 항목)
회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집할 수 있습니다.

1. 필수정보: 이름, 이메일, 비밀번호, 전화번호
2. 선택정보: 자기소개서 내용, 프로필 정보
3. 자동 수집 정보: IP 주소, 쿠키, 접속 기록

제 3 조 (개인정보의 보유 및 이용 기간)
회사는 이용자의 개인정보를 원칙적으로 회원 탈퇴 시까지 보유하며, 법령에 따라 일정 기간 보관될 수 있습니다.

제 4 조 (개인정보의 제3자 제공)
회사는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않으며, 필요한 경우 사전에 동의를 받습니다.

제 5 조 (개인정보 보호 조치)

1. 회사는 이용자의 개인정보를 보호하기 위해 기술적, 관리적 보안 조치를 시행합니다.
2. 이용자는 자신의 개인정보를 보호할 책임이 있으며, 타인에게 유출되지 않도록 주의해야 합니다.

제 6 조 (개인정보의 파기 절차 및 방법)

1. 회사는 개인정보의 보유 기간이 경과하거나 처리 목적이 달성된 경우 지체 없이 파기합니다.
2. 전자적 파일 형태의 정보는 복구할 수 없는 방법으로 영구 삭제하며, 종이 문서는 파쇄하여 폐기합니다.

제 7 조 (이용자의 권리)

1. 이용자는 자신의 개인정보에 대해 열람, 정정, 삭제 요청을 할 수 있습니다.
2. 개인정보 관련 문의는 고객센터를 통해 접수할 수 있으며, 회사는 신속하게 처리합니다.

제 8 조 (개인정보 보호 책임자)
개인정보 보호에 관한 문의 사항은 아래의 담당자에게 연락하시기 바랍니다.

- 개인정보 보호 책임자: [김주혁]
- 이메일: [kim1332610@nate.com]
- 연락처: [010-5221-8948]
`;