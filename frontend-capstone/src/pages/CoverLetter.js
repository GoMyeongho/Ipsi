import styled from "styled-components";
import { useState, useEffect } from "react";
import DocumentsApi from "../api/DocumentsApi";
import { useNavigate } from "react-router-dom";

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
  cursor: pointer; /* 클릭 가능하게 설정 */
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  background-color: #6200ea;
  color: white;
  border: none;
  padding: 10px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #3700b3;
  }

  &:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
  }
`;

// 이름 가운제 * 변경 관련련
const replaceMiddleChar = (str) => {
  if (!str || typeof str !== "string") {
    // str이 falsy(null, undefined, 빈 문자열)거나 문자열이 아닌 경우 기본값 반환
    console.warn("Invalid input for replaceMiddleChar:", str);
    return ""; // 기본값으로 빈 문자열 반환
  }

  const len = str.length;
  if (len === 0) return str; // 빈 문자열일 경우 원본 반환

  const middleIndex = Math.floor(len / 2); // 가운데 글자 인덱스
  return str.slice(0, middleIndex) + "*" + str.slice(middleIndex + 1); // 가운데 글자를 '*'로 변경
};

const CoverLetter = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const [dropDwonList, setDropDownList] = useState([]); // DropDown 데이터 상태
  const [selectedUniv, setSelectedUniv] = useState(""); // 선택한 대학
  const [selectedDept, setSelectedDept] = useState(""); // 선택한 학과
  const [departments, setDepartments] = useState([]); // 선택한 대학의 학과 리스트
  const [contentItems, setContentItems] = useState([]); // 전체 데이터 상태
  const [filteredItems, setFilteredItems] = useState([]); // 필터링된 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [dropDownError, setDropDownError] = useState(null); // DropDown 에러 상태
  const [contentsError, setContentsError] = useState(null); // 자소서 데이터 에러 상태

  // 페이지네이션 상태 관리
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [itemsPerPage, setItemsPerPage] = useState(3); // 페이지당 항목 수
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수

  // 페이지네이션 로직: 현재 페이지에 맞는 항목 가져오기
  const indexOfFirstItem = 0;
  const currentItems = filteredItems.slice(
    indexOfFirstItem,
    Math.min(filteredItems.length)
  );

  // 페이지네이션 로직: 슬라이딩 윈도우 방식으로 페이지 번호 계산
  const pageCount = 5; // 한 번에 표시할 페이지 번호의 개수
  const startPage = Math.floor((currentPage - 1) / pageCount) * pageCount + 1; // 시작 페이지 번호
  const endPage = Math.min(startPage + pageCount - 1, totalPages); // 끝 페이지 번호

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // "다음" 버튼 클릭 핸들러
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // "이전" 버튼 클릭 핸들러
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // DropDown 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await DocumentsApi.getDropDownList();
        // console.log(response);
        if (response.data) {
          const data = response.data;

          // 대학별로 학과 리스트를 그룹화
          const departmentsByUniv = data.reduce((acc, item) => {
            const { univName, departments } = item;
            // 1. 대학 이름이 acc 객체에 없으면 빈 배열을 만들어서 넣어줍니다.
            if (!acc[univName]) {
              acc[univName] = [];
            }
            // 2. 대학 이름에 해당하는 학과들을 배열로 추가합니다.
            acc[univName] = [...acc[univName], ...departments];
            // 3. 최종적으로 누적된 객체를 반환합니다.
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
  const fetchData = async () => {
    try {
      setLoading(true);

      const params = {
        page: currentPage,
        limit: itemsPerPage,
        univName: selectedUniv,
        univDept: selectedDept,
      };
      console.log(params);
      const response = await DocumentsApi.getContents(
        params.page,
        params.limit,
        params.univName,
        params.univDept
      );

      const items = response.content || response.items;

      console.log(items); // 데이터 확인용
      setContentItems(items);
      setFilteredItems(items); // 필터링된 항목 업데이트
      setTotalPages(
        response.totalPages || Math.ceil(items.length / itemsPerPage)
      ); // 전체 페이지 수 계산
    } catch (err) {
      setContentsError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 페이지가 변경될 때마다 데이터 새로 가져오기
  useEffect(() => {
    fetchData(); // 페이지 변경 시 데이터 가져오기
  }, [currentPage, itemsPerPage]); // 의존성 배열에 currentPage, itemsPerPage, selectedUniv, selectedDept 추가

  // 대학 선택 핸들러
  const handleUnivChange = (event) => {
    const selectedUnivName = event.target.value;
    setSelectedUniv(selectedUnivName);

    // 선택한 대학에 해당하는 학과 리스트 업데이트
    const selectedDepartments = dropDwonList[selectedUnivName] || []; // || 논리 OR 연산자 : 왼쪽값이 falsy일경우 빈 배열 반환, 드롭다운리스트안에있는 ["대학명"] 키를 확인해 해당하는 값을 반환
    const uniqueDepartments = [...new Set(selectedDepartments)]; // 중복된 학과 제거
    setDepartments(uniqueDepartments);

    // 학과를 리셋
    setSelectedDept("");
  };

  // 학과 선택 핸들러
  const handleDeptChange = (event) => {
    setSelectedDept(event.target.value); // 학과 선택시 상태 업데이트
  };

  // "검색" 버튼 클릭 핸들러
  const handleSearch = () => {
    fetchData();
    let filtered = contentItems;

    // 대학이 선택되었을 경우 필터링
    if (selectedUniv !== "") {
      filtered = filtered.filter((item) => item.univName === selectedUniv);
    }

    // 학과가 선택되었을 경우 필터링
    if (selectedDept !== "") {
      filtered = filtered.filter((item) => item.univDept === selectedDept);
    }

    // 필터링된 데이터를 상태에 저장하고, 페이지를 1로 설정
    setFilteredItems(filtered);
    setCurrentPage(1); // 검색 시 첫 페이지로 리셋
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

  const handlePurchaseClick = (productData) => {
    console.log("선택된 상품:", productData);
    // 결제 로직 추가
    const productItem = {
      id: productData.id, // 상품 ID
      fileTitle: productData.fileTitle,
      univName: productData.univName, // 대학명
      univDept: productData.univDept, // 학과명
      memberName: productData.memberName, // 작성자 이름
      price: productData.price, // 가격
    };

    // alert(`상품 구매를 진행합니다.\n대학: ${productItem.univName}\n학과: ${productItem.univDept}\n가격: ${productItem.price}원`);

    // CheckOut.js로 이동하며 상품 정보를 전달
    navigate("/checkOutPage", { state: { productItem } });
  };

  const handleTopClick = (selectedData) => {
    navigate("/coverLetterDetail", { state: { item: selectedData } } );
  };

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
        {currentItems && currentItems.length > 0 ? (
          currentItems.map((item, index) => (
            <ContentsBox onClick={() => handleTopClick(item)} key={index}>
              <ContentsTop>
                <UnivLogo>
                  <img src={item.univImg} alt="" />
                </UnivLogo>
                <UnivName>{item.univName}</UnivName>
                <UnivDeptName>{item.univDept}</UnivDeptName>
              </ContentsTop>
              <ContentsBottom>
                <ContentsBottomBox>
                  <AuthName>{replaceMiddleChar(item.memberName)}</AuthName>
                  <ContentsPrice>{item.price}원</ContentsPrice>
                </ContentsBottomBox>
                <BuyButton BuyButton onClick={() => handlePurchaseClick(item)}>
                  구매하기
                </BuyButton>
              </ContentsBottom>
            </ContentsBox>
          ))
        ) : (
          <div>조건에 맞는 데이터가 없습니다.</div>
        )}
      </Contents>
      {/* 페이지네이션 컨트롤 */}
      <PaginationContainer>
        <PaginationButton
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          {"<<"}
        </PaginationButton>
        <PaginationButton onClick={handlePrev} disabled={currentPage === 1}>
          {"<"}
        </PaginationButton>

        {/* 표시할 페이지 번호들 */}
        {[...Array(endPage - startPage + 1)].map((_, index) => (
          <PaginationButton
            key={startPage + index}
            onClick={() => handlePageChange(startPage + index)}
            disabled={currentPage === startPage + index}
          >
            {startPage + index}
          </PaginationButton>
        ))}

        <PaginationButton
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          {">"}
        </PaginationButton>
        <PaginationButton
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          {">>"}
        </PaginationButton>
      </PaginationContainer>
    </Background>
  );
};

export default CoverLetter;
