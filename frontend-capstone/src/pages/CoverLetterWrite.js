import styled from "styled-components";

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
  border: none;
  padding-top: 3%;
  padding-bottom: 2%;
  display: flex;
  justify-content: space-between;
`;

const Title = styled.div`
  width: 100%;
  font-size: 1vw;
  font-weight: bold;
`;

const Line = styled.div`
  width: 80%; /* 라인의 너비 */
  height: 2px; /* 라인의 두께 */
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
`;

const MiddleTitle = styled.div`

`;

const CoverLetterWrite = () => {
  return(
    <>
      <Background>
        <Top>
          <Title>자기소개서 작성</Title>
        </Top>
        <Line/>
        <Middle>
          <MiddleBox></MiddleBox>
          <MiddleTitle>새 자기소개서</MiddleTitle>
        </Middle>
      </Background>
    </>
  )
}

export default CoverLetterWrite;