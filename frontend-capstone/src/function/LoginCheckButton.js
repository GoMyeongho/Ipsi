import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Commons from "../util/Common";

const CheckLogin = ({ targetPage }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const accessToken = Commons.getAccessToken();
      try {
        const res = await Commons.IsLogin();
        if (res.data === true) {
          console.log("로그인 상태 확인 완료");
          navigate(targetPage, { replace: true });
        } else {
          alert("로그인 필요");
          navigate("/login", { replace: true });
        }
      } catch (e) {
        console.log(e);
        if (e.response && e.response.status === 401) {
          console.log("로그인 만료, 토큰 재발급 시도 중...");
          try {
            const res = await Commons.handleUnauthorized();
            if (res === false) {
              alert("로그인 해주세요");
              navigate("/", { replace: true });
            }
            const newToken = Commons.getAccessToken();
            if (newToken !== accessToken) {
              const token = await Commons.IsLogin();
              if (token.data === true) {
                console.log("로그인 상태 확인 완료");
                navigate(targetPage, { replace: true });
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
          navigate("/", { replace: true });
        }
      }
    };

    checkLoginStatus();
  }, [navigate, targetPage]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
};

export default CheckLogin;
