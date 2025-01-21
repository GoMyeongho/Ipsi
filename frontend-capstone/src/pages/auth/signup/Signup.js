import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/InputComponent";
import Button from "../../components/ButtonComponent";
import { Container, Items } from "../../components/SignupComponent";
import AuthApi from "../../../api/AuthApi";// Assume you have a function for API requests
import { storage } from "../../api/Firebase";
import styled from "styled-components";
import NavBarModal from "../../components/NavBarModal";

const DEFAULT_PROFILE_URL =
  "https://firebasestorage.googleapis.com/v0/b/project-mini-db956.firebasestorage.app/o/default_profile.png?alt=media&token=6ccfd06d-4d99-4c7b-b603-1baf0517116b";

const Signup = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // States for input values
  const [inputPhone, setInputPhone] = useState("");
  const [inputId, setInputId] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputPw, setInputPw] = useState("");
  const [inputConPw, setInputConPw] = useState("");
  const [inputEmail, setInputEmail] = useState("");

  // Validation states
  const [isId, setIsId] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [isMail, setIsMail] = useState(false);
  const [isPw, setIsPw] = useState(false);
  const [isConPw, setIsConPw] = useState(false);
  const [isName, setIsName] = useState(false);

  // Profile image handling
  const [file, setFile] = useState(null);
  const [profileUrl, setProfileUrl] = useState(DEFAULT_PROFILE_URL);

  // Validation messages
  const [idMessage, setIdMessage] = useState("");
  const [pwMessage, setPwMessage] = useState("");
  const [conPwMessage, setConPwMessage] = useState("");
  const [mailMessage, setMailMessage] = useState("");
  const [phoneMessage, setPhoneMessage] = useState("");

  // Handle file input and display preview
  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileUrl(reader.result); // Set the profile image preview
      };
      reader.readAsDataURL(selectedFile);
    } else {
      alert("유효한 이미지 파일만 선택해주세요.");
    }
  };

  // Handle signup button click
  const onClickSignup = async () => {
    let finalProfileUrl = DEFAULT_PROFILE_URL;

    if (file) {
      const storageRef = storage.ref();
      const fileRef = storageRef.child(file.name);

      try {
        await fileRef.put(file);
        finalProfileUrl = await fileRef.getDownloadURL();
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        alert("이미지 업로드 중 문제가 발생했습니다.");
        return;
      }
    }

    try {
      const memberReg = await AuthApi.signup(
        inputName,
        inputId,
        inputPw,
        inputEmail,
        inputPhone,
        finalProfileUrl
      );
      if (memberReg.data) {
        alert("회원가입에 성공했습니다.");
        navigate("/"); // On success, navigate
      } else {
        alert("회원가입에 실패했습니다.");
      }
    } catch (e) {
      alert("서버가 응답하지 않습니다.");
    }
  };

  // Validate email
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

  // Handle email validation on input change
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

  // Handle password input and validation
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

  // Handle password confirmation
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

  // Handle ID validation
  const onChangeId = async (e) => {
    const idValue = e.target.value;
    setInputId(idValue);

    if (idValue.length < 5 || idValue.length > 15) {
      setIdMessage("아이디는 5자 이상 15자 이하로 입력하세요.");
      setIsId(false);
      return;
    }

    try {
      const resp = await AuthApi.idCheck(idValue);
      if (resp.data === true) {
        setIdMessage("사용 가능한 아이디입니다.");
        setIsId(true);
      } else {
        setIdMessage("중복된 아이디입니다.");
        setIsId(false);
      }
    } catch (error) {
      setIdMessage("아이디 중복 검사에 실패했습니다.");
      setIsId(false);
    }
  };

  // Handle phone validation
  const onChangePhone = (e) => {
    const phoneValue = e.target.value;
    setInputPhone(phoneValue);

    // const phoneRegex = /^[0-9]{10,13}$/;
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phoneValue)) {
      setPhoneMessage("전화번호 형식이 올바르지 않습니다.");
      setIsPhone(false);
    } else {
      setPhoneMessage("올바른 전화번호입니다.");
      setIsPhone(true);
    }
  };

  const onChangeName = (e) => {
    setInputName(e.target.value);
    setIsName(true);
  };
  return (
    <Container>
      <ProfileWrapper>
        <ProfileImage>
          {profileUrl ? (
            <img src={profileUrl} alt="Profile" />
          ) : (
            <span>이미지 미리보기</span>
          )}
          <FileInputLabel>
            +
            <FileInput
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
            />
          </FileInputLabel>
        </ProfileImage>
      </ProfileWrapper>
      <Items variant="title">
        <p>이름</p>
      </Items>
      <Items variant="item2">
        <Input
          type="text"
          placeholder="이름을 입력해주세요"
          value={inputName}
          onChange={onChangeName}
        />
      </Items>
      <Items variant="title">
        <p>아이디</p>
      </Items>
      <Items variant="item2">
        <Input
          type="text"
          placeholder="아이디 입력 (5~15자)"
          value={inputId}
          onChange={onChangeId}
        />
      </Items>
      <Items variant="hint">
        {inputId.length > 0 && (
          <span className={isId ? "success" : "error"}>{idMessage}</span>
        )}
      </Items>
      <Items variant="title">
        <p>비밀번호</p>
      </Items>
      <Items variant="item2">
        <Input
          type="password"
          placeholder="비밀번호 입력 (숫자,영문자,특수문자 포함 8~25자)"
          value={inputPw}
          onChange={onChangePw}
        />
      </Items>
      <Items variant="hint">
        {inputPw.length > 0 && (
          <span className={isPw ? "success" : "error"}>{pwMessage}</span>
        )}
      </Items>
      <Items variant="title">
        <p>비밀번호 확인</p>
      </Items>
      <Items variant="item2">
        <Input
          type="password"
          placeholder="비밀번호 재입력"
          value={inputConPw}
          onChange={onChangeConPw}
        />
      </Items>
      <Items variant="hint">
        {inputConPw.length > 0 && (
          <span className={isConPw ? "success" : "error"}>{conPwMessage}</span>
        )}
      </Items>
      <Items variant="title">
        <p>이메일 주소</p>
      </Items>
      <Items variant="item2">
        <Input
          type="email"
          placeholder="이메일 주소 입력"
          value={inputEmail}
          onChange={onChangeMail}
        />
      </Items>
      <Items variant="hint">
        {inputEmail.length > 0 && (
          <span className={isMail ? "success" : "error"}>{mailMessage}</span>
        )}
      </Items>
      <Items variant="title">
        <p>전화번호</p>
      </Items>
      <Items variant="item2">
        <Input
          type="text"
          placeholder="전화번호 -(하이픈)포함 13자리 입력"
          value={inputPhone}
          onChange={onChangePhone}
        />
      </Items>
      <Items variant="hint">
        {inputPhone.length > 0 && (
          <span className={isPhone ? "success" : "error"}>{phoneMessage}</span>
        )}
      </Items>
      <Items variant="item2">
        { isId && isPw && isConPw && isMail && isPhone ? (
          <Button enabled onClick={onClickSignup}>
            NEXT
          </Button>
        ) : (
          <Button disabled>NEXT</Button>
        )}
      </Items>
    </Container>
  );
};

const ProfileWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 30px 0 20px 0;
`;

const ProfileImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  span {
    font-size: 18px;
  }
`;

const FileInputLabel = styled.label`
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 5px;
  cursor: pointer;
  border-radius: 50%;
`;

const FileInput = styled.input`
  display: none;
`;

export default Signup;
