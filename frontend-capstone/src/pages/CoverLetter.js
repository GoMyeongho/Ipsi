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

const Search = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: calc(6px + 1vw); /* 드롭다운 간의 간격을 20px로 설정 */
`;

const DropdownContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: calc(6px + 1vw); /* 드롭다운 간의 간격을 20px로 설정 */
`;

const Dropdown = styled.select`
  width: 100%;
  padding: 10px;
  text-align: center; /* 텍스트를 가운데 정렬 */
  border: none;
  border-radius: 5px;
  background-color: #fff;
  font-size: calc(5px + 0.6vw);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #3498db;
  }

  &:focus {
    border-color: #3498db;
    outline: none;
  }

  option {
    width: 100%;
  }
`;

const KeywordSearchContainer = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 30px;
`;

const KeywordSearch = styled.input`
  width: 100%;
  height: 100%;
  border: none;

  text-align: center; /* 텍스트를 가운데 정렬 */
`;

const KeywordSearchButton = styled.button`
  width: 40px;
  aspect-ratio: 1 / 1;
  min-width: 30px;
  min-height: 30px;
  background-color: black;
  border-radius: 50%;
  border: none;
  outline: none;
  background-image: url(https://firebasestorage.googleapis.com/v0/b/photo-island-eeaa3.firebasestorage.app/o/KH_Comprehensive_Project%2Fsearh.png?alt=media&token=9eed2c07-0961-44c9-a298-c6b984bc680c);
  background-size: 50% 50%;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Line = styled.div`
  width: 80%; /* 라인의 너비 */
  height: 2px; /* 라인의 두께 */
  background-color: black; /* 라인의 색상 */
  margin-bottom: 1%;
`;

const Contents = styled.div`
  width: 80%;
  height: 80%;
  padding: 20%;
  border: 2px solid black;
  display: flex;
  justify-content: space-between;
`;

const CoverLetter = () => {
  return (
    <>
      <Background>
        <Top>
          <Title>자기소개서</Title>
          <Search>
            <DropdownContainer>
              <Dropdown>
                <option value="">대학명</option>
              </Dropdown>

              <Dropdown>
                <option value="">학과명</option>
              </Dropdown>
            </DropdownContainer>
            <KeywordSearchContainer>
              <KeywordSearch placeholder="키워드검색" />
              <KeywordSearchButton />
            </KeywordSearchContainer>
          </Search>
        </Top>
        <Line />
        <Contents></Contents>
      </Background>
    </>
  );
};

export default CoverLetter;
