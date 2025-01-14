import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Commons from "../util/Common";

const CheckLogin = ({ targetPage }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);  // 로딩 상태

  useEffect(() => {
    const checkLoginStatus = async () => {
      setIsLoading(true);  // 인증 절차 시작 시 로딩 상태로 설정
      const accessToken = Commons.getAccessToken();
      try {
        const res = await Commons.IsLogin();
        if (res.data === true) {
          console.log("로그인 상태 확인 완료");
          navigate(targetPage, { replace: true });  // 로그인 상태면 페이지 이동
        } else {
          alert("로그인 필요");
          navigate("/login", { replace: true });  // 로그인 안되어 있으면 로그인 페이지로 이동
        }
      } catch (e) {
        console.log(e);
        if (e.response && e.response.status === 401) {
          console.log("로그인 만료, 토큰 재발급 시도 중...");
          try {
            const res = await Commons.handleUnauthorized();
            if (res === false) {
              alert("로그인 해주세요");
              navigate("/", { replace: true });  // 토큰 재발급 실패 시 로그인 페이지로 이동
            }
            const newToken = Commons.getAccessToken();
            if (newToken !== accessToken) {
              const token = await Commons.IsLogin();
              if (token.data === true) {
                console.log("로그인 상태 확인 완료");
                navigate(targetPage, { replace: true });  // 로그인 후 페이지 이동
              } else {
                alert("로그인 해주세요!");
                navigate("/", { replace: true });
              }
            }
          } catch (e) {
            console.log(e);
            alert("세션이 만료되었습니다. 다시 로그인해주세요.");
            navigate("/", { replace: true });
          }
        } else {
          console.log("예기치 않은 오류 발생");
          navigate("/", { replace: true });  // 다른 오류 발생 시 로그인 페이지로 이동
        }
      } finally {
        setIsLoading(false);  // 요청 완료 후 로딩 종료
      }
    };

    checkLoginStatus();  // 로그인 상태 체크 함수 실행
  }, [navigate, targetPage]);  // 의존성 배열에 navigate와 targetPage 추가

  // 인증 중일 때 로딩 상태 메시지 표시
  return (
    <div>
      {isLoading ? (
        <p>로그인 상태 확인 중...</p>  // 로딩 중 메시지
      ) : (
        <button onClick={() => navigate(targetPage)}>페이지 이동</button>  // 로딩 종료 후 버튼 표시
      )}
    </div>
  );
};

export default CheckLogin;
// 사용 할때는 
{/* <CheckLogin targetPage="/dashboard" />   */}