import styled from "styled-components";

const Background = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Top = styled.div`
  width: 80%;
  height: 20%;
  padding: 3%;
  border: none;
  display: flex;
  justify-content: space-between;
`

const Title = styled.div`
width: 50%;
font-size: 1vw;
font-weight: bold;

`
const Search = styled.div`
`

const Contents = styled.div`
  width: 80%;
  height: 80%;
  padding: 20%;
  border: 2px solid black;
  display: flex;
  justify-content: space-between;
`

const CoverLetter = () => {
  return(
    <>
      <Background>
        <Top>
          <Title>
            자기소개서
          </Title>
          <Search>

          </Search>
        </Top>
        <Contents></Contents>
      </Background>
    </>
  )
}

export default CoverLetter
