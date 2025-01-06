import styled from "styled-components";
import { useState, useEffect } from "react";
import AxiosApi from "../api/AxiosApi";

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
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
`;

const ContentsBox = styled.div`
  width: 15%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ContentsTop = styled.div`
  width: 100%;
  border: 1px solid black;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 1); /* 그림자 추가로 구분 */
`;

const UnivLogo = styled.div`
  width: 100%;
  margin-top: 5%;
  img {
    width: 50%; // 원하는 크기로 비율을 설정하거나 px 값으로 설정할 수 있습니다
    height: auto; // 자동으로 비율에 맞게 높이를 조정
  }
`;

const UnivName = styled.div`
  width: 100%;
  margin-bottom: 2%;
`;

const UnivDeptName = styled.div`
  width: 100%;
  margin-bottom: 5%;
`;

const ContentsBottom = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const ContentsBottomBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 3%;
`;

const AuthName = styled.div`
  width: 100%;
`;

const ContentsPrice = styled.div`
  width: 100%;
`;

const BuyButton = styled.button`
  background-color: #6200ea;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background-color: #3700b3;
  }
`;

const replaceMiddleChar = (str) => {
  const len = str.length;
  if (len === 0) return str; // 빈 문자열일 경우 원본 반환
  const middleIndex = Math.floor(len / 2); // 가운데 글자 인덱스
  return str.slice(0, middleIndex) + "*" + str.slice(middleIndex + 1); // 가운데 글자를 '*'로 변경
};

const CoverLetter = () => {
  const [dropDwonList, setDropDownList] = useState([]); // DropDown 데이터 상태
  const [selectedUniv, setSelectedUniv] = useState(""); // 선택한 대학
  const [selectedDept, setSelectedDept] = useState(""); // 선택한 학과
  const [departments, setDepartments] = useState([]); // 선택한 대학의 학과 리스트
  const [contentItems, setContentItems] = useState([]); // 전체 데이터 상태
  const [filteredItems, setFilteredItems] = useState([]); // 필터링된 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [dropDownError, setDropDownError] = useState(null); // DropDown 에러 상태
  const [contentsError, setContentsError] = useState(null); // 자소서 데이터 에러 상태

  // DropDown 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosApi.getDropDownList();
        if (response.data) {
          const data = response.data;

          // 대학별로 학과 리스트를 그룹화
          const departmentsByUniv = data.reduce((acc, item) => {
            const { univName, departments } = item;
            if (!acc[univName]) {
              acc[univName] = [];
            }
            acc[univName] = [...acc[univName], ...departments];
            return acc;
          }, {});

          // 그룹화된 학과 리스트 상태로 저장
          setDropDownList(departmentsByUniv);
        }
      } catch (err) {
        setDropDownError(err.message);
      }
    };
    fetchData();
  }, []);

  // Contents 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await AxiosApi.getContents();
        setContentItems(response.data);
        setFilteredItems(response.data); // 초기에는 전체 데이터를 표시
      } catch (err) {
        setContentsError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 대학 선택 핸들러
  const handleUnivChange = (event) => {
    const selectedUnivName = event.target.value;
    setSelectedUniv(selectedUnivName);

    // 선택한 대학에 해당하는 학과 리스트 업데이트
    const selectedDepartments = dropDwonList[selectedUnivName] || [];
    const uniqueDepartments = [...new Set(selectedDepartments)]; // 중복된 학과 제거
    setDepartments(uniqueDepartments);
    // 대학을 선택했을 때 학과를 리셋하고 필터링된 데이터를 초기화
    setSelectedDept(""); // 학과 초기화
    setFilteredItems(contentItems); // 필터링된 데이터 초기화 (전체 데이터로 복원)
  };

  const handleDeptChange = (event) => {
    setSelectedDept(event.target.value); // 학과 선택시 상태 업데이트
  };

  // "검색" 버튼 클릭 핸들러
  const handleSearch = () => {
    let filtered = contentItems;

    // 대학이 선택되었을 경우 필터링
    if (selectedUniv !== "") {
      filtered = filtered.filter((item) => item.univName === selectedUniv);
    }

    // 학과가 선택되었을 경우 필터링
    if (selectedDept !== "") {
      filtered = filtered.filter((item) => item.univDept === selectedDept);
    }

    setFilteredItems(filtered); // 필터링된 데이터 상태 업데이트
  };

  // 대학명만 고유하게 추출
  const uniqueUnivNames = Object.keys(dropDwonList);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (dropDownError) {
    return <div>DropDownList 에러가 발생했습니다: {dropDownError}</div>;
  }

  if (contentsError) {
    return <div>Contents 에러가 발생했습니다: {contentsError}</div>;
  }

  return (
    <Background>
      <Top>
        <Title>자기소개서</Title>
        <Search>
          <DropdownContainer>
            <Dropdown onChange={handleUnivChange} value={selectedUniv}>
              <option value="">대학명</option>
              {uniqueUnivNames.map((univName, index) => (
                <option key={index} value={univName}>
                  {univName}
                </option>
              ))}
            </Dropdown>

            <Dropdown
              onChange={handleDeptChange}
              value={selectedDept}
              disabled={!selectedUniv}
            >
              <option value="">학과명</option>
              {departments && departments.length > 0 ? (
                departments.map((dept, index) => (
                  <option key={index} value={dept}>
                    {dept}
                  </option>
                ))
              ) : (
                <option value="">선택된 대학에 학과가 없습니다</option>
              )}
            </Dropdown>
          </DropdownContainer>
          <KeywordSearchButton onClick={handleSearch} />
        </Search>
      </Top>
      <Line />
      <Contents>
        {filteredItems && filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <ContentsBox key={index}>
              <ContentsTop>
                <UnivLogo>
                  <img src={item.univImg} alt="" />
                </UnivLogo>
                <UnivName>{item.univName}</UnivName>
                <UnivDeptName>{item.univDept}</UnivDeptName>
              </ContentsTop>
              <ContentsBottom>
                <ContentsBottomBox>
                  <AuthName>{replaceMiddleChar(item.name)}</AuthName>
                  <ContentsPrice>{item.price}원</ContentsPrice>
                </ContentsBottomBox>
                <BuyButton>구매하기</BuyButton>
              </ContentsBottom>
            </ContentsBox>
          ))
        ) : (
          <div>조건에 맞는 데이터가 없습니다.</div>
        )}
      </Contents>
    </Background>
  );
};

export default CoverLetter;
