import styled from "styled-components";
import { useState } from "react";
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

const Dropdown = styled.select`
  margin-left: 8%;
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
    /* 추가 버튼 스타일 */
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

  // 입력 데이터 업데이트 핸들러

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleIntroductionChange = (e) => setIntroduction(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handlePriceChange = (e) => setPrice(e.target.value);
  const handleUnivNameChange = (e) => setUnivName(e.target.value);
  const handleUnivDeptChange = (e) => setUnivDept(e.target.value);
  const handlePreviewFileChange = (e) => setPreviewFile(e.target.files[0]);

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
    updatedKeywords[index] = value;
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
  const isFormValid = title && price && category && file;

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
            <input type="text" value={title} onChange={handleTitleChange} />
          </ItemTitle>
          <Line />
          <FileInput>
            자료파일
            <input type="file" onChange={handleFileChange} />
          </FileInput>
          <Line />
          <ItemPrice>
            가격
            <input type="number" value={price} onChange={handlePriceChange} />원
          </ItemPrice>
          <Line />
          <Classification>
            분류
            <Dropdown value={category} onChange={handleCategoryChange}>
              <option value="">자소서/생기부</option>{" "}
              {/* 기본값으로 자소서/생기부 표시 */}
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Dropdown>
          </Classification>
          <Line />
          <UnivName>
            대학
            <input
              type="text"
              value={univName}
              onChange={handleUnivNameChange}
            />
          </UnivName>
          <Line />
          <UnivDept>
            학부/학과
            <input
              type="text"
              value={univDept}
              onChange={handleUnivDeptChange}
            />
          </UnivDept>
        </MainBox>
        <SubBox>
          <p>추가정보</p>
          <Preview>
            미리보기 파일
            <input type="file" onChange={handlePreviewFileChange} />
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
                  placeholder={`키워드 ${index + 1}`}
                />
                <button onClick={() => handleRemoveKeyword(index)}>-</button>
              </div>
            ))}
            <button className="add-button" onClick={handleAddKeyword}>
              +
            </button>{" "}
            {/* 보라색 추가 버튼 */}
          </KeyWordTag>
          <Line />
          <ContentsIntroduction>
            <p>자료소개</p>
            <textarea
              placeholder="소개글 작성하세요."
              value={introduction}
              onChange={handleIntroductionChange}
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
