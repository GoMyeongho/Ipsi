import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import RejectModal from "./Modal/RejectModal";

const Background = styled.div`
  width: 100%;
  height: 100%;
`;

const Container = styled.div`
  width: 100%;
  margin-top: 3%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Left = styled.div`
  width: 25%;
  padding-left: 5%;
  display: flex;
  flex-direction: column;

  @media (max-width:768px) {
    display: none;
  }
`;

const LeftTitle = styled.div`
  margin-bottom: 10%;
  font-size: clamp(1.3rem, 1.8vw, 2.5rem);
  font-weight: bold;
`;

const SubTitle1 = styled.div`
  font-size: clamp(1rem, 1vw, 2.5rem);
  font-weight: bold;
  margin-bottom: 5%;
  margin-top: 5%;

  p {
    margin-top: 2%;
    font-size: clamp(0.8rem, 1vw, 1rem);
    font-weight: normal;
    cursor: pointer;
  }
`;

const SubTitle2 = styled.div`
  font-size: clamp(1rem, 1vw, 2.5rem);
  font-weight: bold;
  margin-bottom: 5%;
  margin-top: 5%;

  p {
    margin-top: 2%;
    font-size: clamp(0.8rem, 1vw, 1rem);
    font-weight: normal;
    cursor: pointer;
  }
`;

const SubTitle3 = styled.div`
  font-size: clamp(1rem, 1vw, 2.5rem);
  font-weight: bold;
  margin-bottom: 5%;
  margin-top: 5%;

  p {
    margin-top: 2%;
    font-size: clamp(0.8rem, 1vw, 1rem);
    font-weight: normal;
    cursor: pointer;
  }
`;

const SubTitle4 = styled.div`
  font-size: clamp(1rem, 1vw, 2.5rem);
  font-weight: bold;
  margin-bottom: 5%;
  margin-top: 5%;

  p {
    margin-top: 2%;
    font-size: clamp(0.8rem, 1vw, 1rem);
    font-weight: normal;
    cursor: pointer;
  }
`;

const SubTitle5 = styled.div`
 font-size: clamp(1rem, 1vw, 2.5rem);
  font-weight: bold;
  margin-bottom: 5%;
  margin-top: 5%;

  p {
    margin-top: 2%;
    font-size: clamp(0.8rem, 1vw, 1rem);
    font-weight: normal;
    cursor: pointer;
  }
`;

const Right = styled.div`
  width: 70%;

  @media (max-width: 768px) {
    width: 85%;
  }
`;

const MyPageNavBar = () => {
  const navigate = useNavigate(); // 페이지 전환 훅
  const role = useSelector(state => state.persistent.role)
  const [reject, setReject] = useState({});
  useEffect(() => {
    if(role === "REST_USER" || role === "" ) {
      setReject({value: true, label: "해당 기능은 로그인 후 사용 가능 합니다."})
    }
  }, [role]);

  return (
    <>
      <Background>
        <Container>
          <Left>
            <LeftTitle>마이 페이지</LeftTitle>
            <p onClick={() => navigate("")}>닉네임</p>

            <SubTitle1>
              나의 계정정보
              {/* CheckLogin을 사용하여 인증 후 정보수정 페이지로 바로 이동 */}

                <p>회원정보수정</p>
                <p onClick={() => navigate("")}>게시글</p>


              <p onClick={() => navigate("")}>업로드 권한 확인</p>
            </SubTitle1>

            <SubTitle2>
              나의 구매목록
              <p onClick={() => navigate("purchasedEnumPS")}>구매한 자기소개서</p>
              <p onClick={() => navigate("purchasedEnumSR")}>구매한 생활기록부</p>
            </SubTitle2>

            <SubTitle3>
              내가 작성한 글
              <p onClick={() => navigate("")}>게시글</p>
              <p onClick={() => navigate("")}>이용후기</p>
            </SubTitle3>
            
            <SubTitle4>
              자료 업로드
              <p onClick={() => navigate("coverLetterRegister")}>자소서/생기부</p>
            </SubTitle4>

            <SubTitle5>
              내가 업로드한 파일
              <p onClick={() => navigate("UploadedEnumPS")}>자기소개서</p>
              <p onClick={() => navigate("UploadedEnumSR")}>생활기록부</p>
            </SubTitle5>
          </Left>
          <Right>
            <Outlet />
          </Right>
        </Container>
        <RejectModal message={reject.label} open={reject.value} onClose={() => navigate("/")}/>
      </Background>
    </>
  );
};

export default MyPageNavBar;
