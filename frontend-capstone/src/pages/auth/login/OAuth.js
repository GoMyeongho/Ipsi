import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from 'react-cookie';

const OAuth = () => {
  const { token, expirationTime } = useParams(); // URL에서 토큰과 만료시간 받기
  const [cookies, setCookie] = useCookies();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !expirationTime) return;

    // 토큰과 만료시간 처리
    const now = new Date().getTime();
    const expires = new Date(now + Number(expirationTime) * 1000); // expirationTime은 초 단위로 전달됨

    // 쿠키에 토큰 저장
    setCookie('accessToken', token, { expires, path: '/' });

    // 메인 페이지로 리디렉션
    navigate('/');
  }, [token, expirationTime, navigate, setCookie]);

  return <></>; // 화면에 아무것도 렌더링하지 않음
};

export default OAuth;
