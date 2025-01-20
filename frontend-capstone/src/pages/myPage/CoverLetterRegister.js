import styled from "styled-components";
import { useState, useEffect } from "react";
import MyPageApi from "../../api/myPageApi";

const Background = styled.div`
  width: 80%;
  height: 100%;
`;

const ContainerBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  width: 100%;
  font-size: large;
  font-weight: bold;

  p {
    margin-top: 2%;
    padding-left: 3%;
    font-size: medium;
  }
`;

const MainBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ItemTitle = styled.div`
  width: 100%;
  margin-top: 3%;
  padding-left: 3%;

  input {
    text-align: left;
    width: 70%;
    margin-left: 5%;
    border: none;
  }
`;

const FileInput = styled.div`
  width: 100%;
  margin-top: 2%;
  padding-left: 3%;

  input {
    margin-left: 10%;
    border: none;
  }
`;

const ItemPrice = styled.div`
  width: 100%;
  margin-top: 2%;
  padding-left: 3%;

  input {
    text-align: right;
    width: 15%;
    margin-left: 5%;
    border: none;

    /* 화살표 숨기기 */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

const Classification = styled.div`
  width: 100%;
  margin-top: 2%;
  padding-left: 3%;
`;

const Dropdown1 = styled.select`
  margin-left: 8%;
  border: none;
`;

const Dropdown2 = styled.select`
  margin-left: 8%;
  border: none;
`;

const Dropdown3 = styled.select`
  margin-left: 3%;
  border: none;
`;

const UnivName = styled.div`
  width: 100%;
  margin-top: 2%;
  padding-left: 3%;
`;

const UnivDept = styled.div`
  width: 100%;
  margin-top: 2%;
  padding-left: 3%;
`;

const SubBox = styled.div`
  width: 100%;
  margin-top: 3%;

  P {
    margin-top: 2%;
    padding-left: 3%;
    font-size: medium;
  }
`;

const Preview = styled.div`
  width: 100%;
  margin-top: 2%;
  padding-left: 3%;

  input {
    margin-left: 5%;
    border: none;
  }
`;

const KeyWordTag = styled.div`
  width: 100%;
  margin-top: 2%;
  padding-left: 3%;

  .keyword-input {
    display: flex;
    align-items: center;
    margin-bottom: 5px;

    input {
      margin-right: 10px;
      border: none;
      padding: 5px;
      width: 200px;
    }

    button {
      background-color: #6200ea; /* 보라색 */
      color: white;
      border: none;
      border-radius: 3px;
      padding: 5px 8px;
      cursor: pointer;

      &:hover {
        background-color: #3700b3; /* 어두운 보라색 */
      }
    }
  }

  .add-button {
    background-color: #6200ea; /* 보라색 */
    color: white;
    border: none;
    border-radius: 3px;
    margin-left: 1%;
    padding: 5px 8px;
    cursor: pointer;

    &:hover {
      background-color: #3700b3; /* 어두운 보라색 */
    }
  }
`;

const SaveButton = styled.button`
  width: 15%;
  height: 30%;
  margin-top: 5%;
  align-self: flex-end; /* 부모의 오른쪽 끝으로 이동 */
  background-color: #4caf50; /* 활성화된 버튼 색상 */
  color: white;
  border: none;
  cursor: pointer;
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

  &:disabled {
    background-color: #cccccc; /* 비활성화된 버튼 색상 */
    cursor: not-allowed;
  }
`;

const ContentsIntroduction = styled.div`
  width: 100%;
  margin-top: 2%;
  border: none;

  textarea {
    width: 97%;
    margin-top: 2%;
    margin-left: 3%;
    border: none;
    height: 10vh;
  }
`;

const Line = styled.hr`
  margin-top: 2%;
  color: silver;
`;

const CoverLetterRegister = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [introduction, setIntroduction] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [keywords, setKeywords] = useState([""]);
  const [univName, setUnivName] = useState("");
  const [univDept, setUnivDept] = useState("");
  const [previewFile, setPreviewFile] = useState(null);

  // 대학과 학과 데이터를 저장할 상태
  const [univList, setUnivList] = useState([]);
  const [deptList, setDeptList] = useState([]);

  // 대학 목록과 학과 목록을 불러오는 함수
  const fetchUnivAndDepts = async () => {
    try {
      // 대학 목록을 받아오기
      const univResponse = await MyPageApi.getUnivList();
      const univData = univResponse.data;

      // 중복 제거 로직: univName 기준으로 중복 제거
      const uniqueUnivList = Array.from(
        new Set(univData.map((item) => item.univName))
      ).map((name) => ({ univName: name }));

      // 중복 제거된 대학 목록을 상태로 업데이트
      setUnivList(uniqueUnivList);

      // 처음 대학을 선택한 경우, 해당 대학에 맞는 학과 목록을 받아오기
      if (univName) {
        const deptResponse = await MyPageApi.getDeptList(univName);
        console.log(deptResponse);

        // 중복된 학과를 제거하기 위해 Set을 사용하여 deptNames 배열을 만듭니다.
        const uniqueDeptNames = [
          ...new Set(deptResponse.data.map((dept) => dept.deptName)),
        ];
        console.log(uniqueDeptNames);

        // 상태를 한 번에 업데이트하여 학과 목록을 설정
        setDeptList(uniqueDeptNames);
      }
    } catch (error) {
      console.error("대학/학과 데이터 로딩 실패", error);
    }
  };

  // 대학이 변경될 때마다 학과 목록 업데이트
  const handleUnivNameChange = async (e) => {
    const selectedUnivName = e.target.value;
    setUnivName(selectedUnivName);

    // 해당 대학의 학과 목록을 받아옴
    try {
      const deptResponse = await MyPageApi.getDeptList(selectedUnivName);
      const uniqueDeptNames = [
        ...new Set(deptResponse.data.map((dept) => dept.deptName)),
      ];
      setDeptList(uniqueDeptNames);
    } catch (error) {
      console.error("학과 데이터 로딩 실패", error);
    }
  };

  // 학과 변경 핸들러
  const handleUnivDeptChange = (e) => setUnivDept(e.target.value);

  useEffect(() => {
    fetchUnivAndDepts();
  }, [univName]);

  // 데이터 저장 요청
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("mainFile", file);
    formData.append("summary", introduction);
    formData.append("fileCategory", category);
    formData.append("price", price);
    formData.append("univName", univName);
    formData.append("univDept", univDept);
    formData.append("preview", previewFile);
    formData.append("keywords", JSON.stringify(keywords));

    try {
      const response = await MyPageApi.saveCoverLetterRegister(formData);
      alert("저장되었습니다!");
      console.log(response.data);
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했습니다.");
    }
    formData.forEach((value, key) => {
      console.log(key, value);
    });
  };

  // 드롭다운 옵션 설정
  const options = [
    { value: "PERSONAL_STATEMENT", label: "자기소개서" },
    { value: "STUDENT_RECORD", label: "생활기록부" },
  ];

  const handleKeywordChange = (index, value) => {
    const updatedKeywords = [...keywords];
    // 입력값에 #이 없으면 #을 추가, 있으면 그대로 두기
    if (!value.startsWith("#")) {
      updatedKeywords[index] = `#${value}`;
    } else {
      updatedKeywords[index] = value;
    }
    setKeywords(updatedKeywords);
  };
  
  const handleAddKeyword = () => {
    if (keywords.length < 3) {
      setKeywords([...keywords, ""]); // 최대 3개 제한
    } else {
      alert("키워드는 최대 3개까지 추가할 수 있습니다.");
    }
  };
  

  const handleRemoveKeyword = (index) => {
    const updatedKeywords = keywords.filter((_, i) => i !== index);
    setKeywords(updatedKeywords);
  };

  // 버튼 활성화 조건: 제목, 가격, 분류, 파일이 모두 입력되어야 함
  const isFormValid = title && price && category && file ;

  return (
    <Background>
      <ContainerBox>
        <Title>
          자기소개서 / 생활 기록부 업로드
          <p>필수정보</p>
        </Title>
        <MainBox>
          <ItemTitle>
            제목
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </ItemTitle>
          <Line />
          <FileInput>
            자료파일
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          </FileInput>
          <Line />
          <ItemPrice>
            가격
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            원
          </ItemPrice>
          <Line />
          <Classification>
            분류
            <Dropdown1
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">자소서/생기부</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Dropdown1>
          </Classification>
          <Line />
          <UnivName>
            대학
            <Dropdown2 value={univName} onChange={handleUnivNameChange}>
              <option value="">대학을 선택하세요</option>
              {univList.map((univ) => (
                <option key={univ.univName} value={univ.univName}>
                  {univ.univName}
                </option>
              ))}
            </Dropdown2>
          </UnivName>
          <Line />
          <UnivDept>
            학부/학과
            <Dropdown3 value={univDept} onChange={handleUnivDeptChange}>
              <option value="">학과를 선택하세요</option>
              {Array.isArray(deptList) &&
                deptList.map((dept, index) => (
                  <option key={index} value={dept}>
                    {dept}
                  </option>
                ))}
            </Dropdown3>
          </UnivDept>
        </MainBox>
        <SubBox>
          <p>추가정보</p>
          <Preview>
            미리보기 파일
            <input
              type="file"
              onChange={(e) => setPreviewFile(e.target.files[0])}
            />
          </Preview>
          <Line />
          <KeyWordTag>
            키워드(최대3개)
            {keywords.map((keyword, index) => (
  <div key={index} className="keyword-input">
    <input
      type="text"
      value={keyword}
      onChange={(e) => handleKeywordChange(index, e.target.value)}
      placeholder={` ${index + 1}.'#' 포함없이 입력하세요.`}
    />
    <button onClick={() => handleRemoveKeyword(index)}>-</button>
  </div>
))}
            <button className="add-button" onClick={handleAddKeyword}>
              +
            </button>{" "}
          </KeyWordTag>
          <Line />
          <ContentsIntroduction>
            <p>자료소개</p>
            <textarea
              placeholder="소개글 작성하세요."
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
            />
          </ContentsIntroduction>
        </SubBox>
        <SaveButton onClick={handleSave} disabled={!isFormValid}>
          자료 업로드
        </SaveButton>
      </ContainerBox>
    </Background>
  );
};

export default CoverLetterRegister;
