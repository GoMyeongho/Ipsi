import styled from "styled-components";

const Background = styled.div`
  width: 100%;
  margin-left: 10%;
  margin-right: 10%;
`
const Search = styled.div`
  width: 100%;
  height: 20%;
  border: 2px solid black;
`

const Contents = styled.div`
`

const CoverLetter = () => {
  return(
    <>
      <Background>
        <Search><p>오늘도무엇을</p></Search>
      
      </Background>
    </>
  )
}

export default CoverLetter
