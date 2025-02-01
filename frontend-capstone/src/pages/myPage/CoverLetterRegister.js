import styled from "styled-components";
import { useState, useEffect } from "react";
import MyPageApi from "../../api/MyPageApi";

const Background = styled.div`
  width: 80%;
  height: 100%;

  @media (max-width:768px) {
    width: 90%;
    margin-left: 5%;
  }
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
    height: 20px;
    margin-left: 5%;
    border: none;

    &:focus {
      outline: none;
    }
  }
`;

const MainFile = styled.div`
  width: 100%;
  margin-top: 2%;
  padding-left: 3%;

  input {
    opacity: 0; /* 파일 선택 버튼을 숨김 */
  }

  label {
    margin-left: 5%;
    background-color: #6154d4;
    color: white;
    padding: 5px 5px;
    cursor: pointer;
    border-radius: 4px;
  }
`;

const ItemPrice = styled.div`
  width: 100%;
  margin-top: 2%;
  padding-left: 3%;

  input {
    text-align: start;
    width: 70%;
    margin-left: 5%;
    border: none;

    &:focus {
      outline: none;
    }

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
    font-weight: bold;
  }
`;

const Preview = styled.div`
  width: 100%;
  margin-top: 2%;
  padding-left: 3%;

  input {
    opacity: 0; /* 파일 선택 버튼을 숨김 */
  }

  label {
    margin-left: 5%;
    background-color: #6154d4;
    color: white;
    padding: 5px 5px;
    cursor: pointer;
    border-radius: 4px;
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
  min-width: 100px;
  height: 50px;
  margin-top: 5%;
  margin-bottom: 100px;
  align-self: flex-end; /* 부모의 오른쪽 끝으로 이동 */
  background-color: #6200ea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: clamp(0.8rem, 0.8vw, 2.5rem);

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

const FileItem = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;

  span {
    margin-right: 10px;
  }

  button {
    background-color: #e53935; /* 빨간색 */
    color: white;
    border: none;
    border-radius: 3px;
    padding: 5px 8px;
    cursor: pointer;

    &:hover {
      background-color: #b71c1c; /* 더 어두운 빨간색 */
    }
  }
`;

const PreviewFileItem = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;

  span {
    margin-right: 10px;
  }

  button {
    background-color: #e53935; /* 빨간색 */
    color: white;
    border: none;
    border-radius: 3px;
    padding: 5px 8px;
    cursor: pointer;

    &:hover {
      background-color: #b71c1c; /* 더 어두운 빨간색 */
    }
  }
`;
const CoverLetterRegister = () => {
  const [title, setTitle] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [keywords, setKeywords] = useState([""]);
  const [univName, setUnivName] = useState("");
  const [univDept, setUnivDept] = useState("");
  const [file, setFile] = useState(null); // mainFile 첨부파일
  const [previewFile, setPreviewFile] = useState(null); // previewFile 첨부 파일
  const [mainFileErr, setMainFileErr] = useState(""); // 첨부 파일 검증 Err
  const [previewFileErr, setPreviewFileErr] = useState(""); // 첨부 파일 검증 Err

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
    formData.append("folderPath", "test/test");
    console.log([...formData]);

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
    // value 값 ==  BackEnd enum 값
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

  // 파일 첨부 관련 제한 조건
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 최대 파일 크기 (5MB)
  const ALLOWED_EXTENSIONS = ["jpg", "png", "pdf", "zip"]; // 허용 확장자
  const ENGLISH_ONLY_REGEX = /^[a-zA-Z0-9_.-]+$/; // 영어, 숫자, _, ., - 만 허용

  // MainFile 자료 첨부
  const handleMainFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const fileName = selectedFile.name;
    const fileExtension = fileName.split(".").pop().toLowerCase();
    const errors = []; // 에러 메시지 배열

    // 파일 이름 검증
    if (!ENGLISH_ONLY_REGEX.test(fileName)) {
      errors.push("파일 이름은 영어와 숫자만 허용됩니다.");
    }
    // 파일 크기 검증
    if (selectedFile.size > MAX_FILE_SIZE) {
      errors.push("파일 크기가 10MB를 초과합니다.");
    }
    // 파일 확장자 검증
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      errors.push(
        `허용되지 않는 파일 형식입니다. (${ALLOWED_EXTENSIONS.join(", ")})`
      );
    }

    if (errors.length > 0) {
      // 에러가 있으면 첫 번째 에러 메시지를 보여주고 파일 초기화
      setMainFileErr(errors[0]);
      setFile(null); // 파일 초기화
    } else {
      // 검증 통과 시 파일 설정
      setMainFileErr(""); // 에러 초기화
      setFile(selectedFile);
    }
  };

  // previewFile 자료 첨부
  const handlePreviewFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const fileName = selectedFile.name;
    const fileExtension = fileName.split(".").pop().toLowerCase();
    const errors = []; // 에러 메시지 배열

    // 파일 이름 검증
    if (!ENGLISH_ONLY_REGEX.test(fileName)) {
      errors.push("파일 이름은 영어와 숫자만 허용됩니다.");
    }
    // 파일 크기 검증
    if (selectedFile.size > MAX_FILE_SIZE) {
      errors.push("파일 크기가 10MB를 초과합니다.");
    }
    // 파일 확장자 검증
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      errors.push(
        `허용되지 않는 파일 형식입니다. (${ALLOWED_EXTENSIONS.join(", ")})`
      );
    }

    if (errors.length > 0) {
      // 에러가 있으면 첫 번째 에러 메시지를 보여주고 파일 초기화
      setPreviewFileErr(errors[0]);
      setPreviewFile(null); // 파일 초기화
    } else {
      // 검증 통과 시 파일 설정
      setPreviewFileErr(""); // 에러 초기화
      setPreviewFile(selectedFile);
    }
  };

  // 파일 삭제 함수 추가
  const removeMainFile = () => {
    setFile(null);
    setMainFileErr("");
  };

  const removePreviewFile = () => {
    setPreviewFile(null);
    setPreviewFileErr("");
  };

  // 자료 업로드 버튼 활성화 조건: 제목, 가격, 분류, 파일이 모두 입력되어야 함
  const isFormValid =
    title &&
    price &&
    category &&
    file &&
    univName &&
    univDept &&
    previewFileErr === "";

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
              placeholder="제목을 입력하세요."
            />
          </ItemTitle>
          <Line />
          <MainFile>
            자료파일
            <label htmlFor="mainFile-upload">파일 첨부</label>
            <input
              type="file"
              id="mainFile-upload"
              onChange={handleMainFileChange}
            />
            {file && (
              <FileItem>
                <span>{file.name}</span>
                <button onClick={removeMainFile}>삭제</button>
              </FileItem>
            )}
            {/* 파일 에러 메시지 표시 */}
            {mainFileErr && (
              <div style={{ color: "red", marginTop: "5px" }}>
                {mainFileErr}
              </div>
            )}
          </MainFile>
          <Line />
          <ItemPrice>
            가격
            <input
              type="text"
              value={price ? `${price}원` : ""}
              onChange={(e) => {
                // 숫자만 입력받도록 정규식 사용
                const inputValue = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 남기기
                setPrice(inputValue); // 숫자만 상태에 저장
              }}
              placeholder="가격을 입력하세요. (10만원 미만)"
              maxLength={6}
            />
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
            <label htmlFor="previewFile-upload">파일 첨부</label>
            <input
              id="previewFile-upload"
              type="file"
              onChange={handlePreviewFileChange}
            />
            {previewFile && (
              <PreviewFileItem>
                <span>{previewFile.name}</span>
                <button onClick={removePreviewFile}>삭제</button>
              </PreviewFileItem>
            )}
            {/* 파일 에러 메시지 표시 */}
            {previewFileErr && (
              <div style={{ color: "red", marginTop: "5px" }}>
                {previewFileErr}
              </div>
            )}
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
                  placeholder={`'#' 포함없이 입력하세요.`}
                  maxLength={6}
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
