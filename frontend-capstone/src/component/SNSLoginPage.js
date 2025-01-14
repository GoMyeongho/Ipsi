import React from 'react';

const DOMAIN = 'http://localhost:8111'; // 도메인 수정
const API_DOMAIN = `${DOMAIN}/api/v1`;

const SNS_SIGN_IN_URL = (type) => `${API_DOMAIN}/auth/oauth2/${type}`;

const SNSLoginPage = () => {
  // SNS 로그인 버튼 클릭 핸들러
  const onSnsSignInButtonClickHandler = (type) => {
    window.location.href = SNS_SIGN_IN_URL(type);
  };

  return (
    <div>
      <h1>로그인</h1>
      <button onClick={() => onSnsSignInButtonClickHandler('kakao')}>카카오로 로그인</button>
      <button onClick={() => onSnsSignInButtonClickHandler('naver')}>네이버로 로그인</button>
    </div>
  );
};

export default SNSLoginPage;
