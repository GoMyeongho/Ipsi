import React, { useEffect, useState } from "react";

import { useNavigate,useParams } from "react-router-dom"


export default function OAuth({onLogin}) {
  const{token,expirationTime} = useParams();

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 상태 선언

  useEffect(()=> {
    if(!token) return;

 
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refresshToken",token);

    // 부모 컴포넌트에 로그인 상태 알림


    // setIsLoggedIn(true);


      navigate("/");
   
  
  // },[token]);
}, [token, expirationTime, navigate, onLogin]);

return null;




}





// import React, { useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// export default function OAuth({ setIsLoggedIn }) {
//   const { token, expirationTime } = useParams(); // URL에서 파라미터 가져오기
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!token || !expirationTime) return;

//     // 현재 시간과 만료 시간 계산
//     const now = new Date().getTime(); // 현재 시간 (밀리초)
//     const expiresAt = now + Number(expirationTime) * 1000; // 만료 시간 계산

//     // 로컬 스토리지에 토큰과 만료 시간 저장
//     localStorage.setItem("accessToken", token);
//     localStorage.setItem("tokenExpiresAt", expiresAt);

//     // 로그인 상태 설정
    

//     // 홈 화면으로 리다이렉트
//     navigate("/");
//   }, [token]);
 
//   return <></>;
// }
