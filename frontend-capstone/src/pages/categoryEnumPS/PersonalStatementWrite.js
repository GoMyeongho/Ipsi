import styled from "styled-components";
import WriteForm from "../../component/PSWriteComponent/WriteForm";
import BuyPS from "../../component/PSWriteComponent/BuyPS";

const Background = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Top = styled.div`
  width: 80%;
  border-bottom: 1px solid #000;
  padding-top: 3%;
  padding-bottom: 2%;
  display: flex;
  justify-content: space-between;
`;

/*export const Title = styled.div`
  width: 100%;
  //font-size: 1vw;
  font-size: 1rem;
  font-weight: bold;
  margin: 2vw 0;
  @media (max-width: 1024px) {
    margin: 3vw 0;
  }
`;*/

export const Title = styled.div`
  width: 50%;
  font-size: clamp(1rem, 1.3vw, 2.5rem);
  font-weight: bold;
`;

const Line = styled.div`
  width: 80%; /* 라인의 너비 */
  height: 1px; /* 라인의 두께 */
  background-color: black; /* 라인의 색상 */
  margin-bottom: 1%;
`;

const Middle = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;


const MiddleBox = styled.div`
  width: 100%;
  display: flex;
/*  @media (max-width: 1024px) {
    flex-direction: row-reverse;
  }*/
`;



const PersonalStatementWrite = () => {
  return(
    <>
      <Background>
        <Top>
          <Title>자기소개서 작성</Title>
        </Top>
        <Line />
        <Middle>
{/*          <MiddleBox>

          </MiddleBox>*/}
          <WriteForm/>
          {/*<BuyPS/>*/}
        </Middle>
      </Background>
    </>
  )
}

export default PersonalStatementWrite;