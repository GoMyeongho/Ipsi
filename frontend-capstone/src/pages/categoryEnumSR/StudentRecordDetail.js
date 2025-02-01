import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect } from "react";
import DocumentsApi from "../../api/DocumentsApi";

const Background = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Top = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width:768px) {
    width: 100%;
  }
`;

const Title = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const UnivLogo = styled.div`
  width: 50%;
  margin-top: 5%;
  margin-left: 5%;
  img {
    width: 60%; // 원하는 크기로 비율을 설정하거나 px 값으로 설정할 수 있습니다
    min-width: 130px; // 최소 너비를 설정 (원하는 최소 너비로 조정)
  }

  @media (max-width:768px) {
    margin-left: 8%;
  }
`;

const DetailBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const DetailBoxTitle = styled.div`
  width: 100%;
  margin-top: 3%;
  font-weight: bold;
  font-size: clamp(0.9rem, 1.3vw, 2.5rem);
`;

const DetailBoxInfo = styled.div`
  width: 100%;
  margin-top: 3%;
  font-size: clamp(0.8rem, 1.2vw, 2.5rem);

  span {
    margin-right: 3%; /* | 사이의 간격 조정 */
  }
`;

const DetailBoxPrice = styled.div`
  width: 100%;
  margin-top: 3%;
  margin-right: 30%;
  font-size: clamp(0.8rem, 1.2vw, 2.5rem);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: end;
  gap: 5%;
`;

const Line = styled.div`
  width: 70%; /* 라인의 너비 */
  height: 2px; /* 라인의 두께 */
  background-color: black; /* 라인의 색상 */
  margin-bottom: 1%;

  @media (max-width:768px) {
    width: 100%;
  }
`;

const Middle = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width:768px) {
    width: 100%;
  }
`;

const MiddleTitle = styled.div`
  width: 100%;
  margin-left: 10%;
  margin-right: 10%;
  padding-left: 10%;
  padding-right: 10%;
  margin-top: 3%;
  font-size: clamp(1.2rem, 1.4vw, 2.5rem);

  @media (max-width:768px) {
    margin-top: 7%;
  }
`;

const MiddleWrite = styled.div`
  width: 100%;
  height: 300px;
  font-size: clamp(1rem, 1vw, 2.5rem);
  margin-left: 10%;
  margin-right: 10%;
  padding-left: 10%;
  padding-right: 10%;
  margin-top: 3%;
  white-space: pre-wrap; /* 기본적인 줄바꿈 허용 */
  word-wrap: break-word; /* 긴 단어도 자동으로 줄바꿈 */
  overflow-wrap: break-word; /* 텍스트가 박스를 넘지 않도록 자동으로 줄바꿈 */
  word-break: break-word; /* 단어가 박스를 넘으면 줄바꿈 */

  @media (max-width:768px) {
    height: 200px;
  }
`;

const FileDownloadButton = styled.button`
  background-color: #6200ea;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: clamp(0.7rem, 1vw, 2.5rem);

  &:hover {
    background-color: #3700b3;
  }
`;

const BuyButton = styled.button`
  background-color: #6200ea;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: clamp(0.7rem, 1vw, 2.5rem);

  &:hover {
    background-color: #3700b3;
  }
`;

const Bottom = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width:768px) {
    width: 100%;
  }
`;

const BottomTitle = styled.div`
  width: 100%;
  margin-left: 10%;
  margin-right: 10%;
  padding-left: 10%;
  padding-right: 10%;
  margin-top: 3%;
  font-size: clamp(1.2rem, 1.4vw, 2.5rem);
`;

const BottomContainer = styled.div`
  width: 100%;
  margin-left: 10%;
  margin-right: 10%;
  padding-left: 10%;
  padding-right: 10%;
  margin-top: 3%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BottomUploadBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;


const BottomReviewWrite = styled.input`
  width: 80%;
  height: 60px;
  border-radius: 10px;
  font-size: large;

  @media (max-width:768px) {
    width: 75%;
    height: 30px;
    border-radius: 5px;
    font-size: small;
  }
`;

const BottomButton = styled.button`
  width: 10%;
  height: 60px;
  border-radius: 10px;
  border: none;
  background-color: #6154D4;
  color: white;
  font-size: clamp(1rem, 1vw, 2.5rem);

  &:hover {
    opacity: 0.8;
  }

  &:active {
    transform: scale(0.95);
  }
  

  @media (max-width:768px) {
    width: 15%;
    height: 40px;
    border-radius: 5px;
  }
`;

const ReviewListBox = styled.div`
  width: 100%;
  margin-top: 5%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ReviewListTop = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ReviewName = styled.div`
  width: 33%;
  font-weight: bold;
`;

const ReviewTime = styled.div`
  width: 50%;
  text-align: end;
  font-weight: bold;
`;

const ReviewListBottom = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ReviewContent = styled.div`
  width: 100%;
  margin-top: 1%;
  text-align: start;
`;

const ReviewLine = styled.div`
  width: 100%;
  margin-top: 1%;
  margin-bottom: 1%;
  border: 1px solid rgba(128,128,128,0.5);
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  background-color: ${(props) =>
    props.isActive
      ? "#6200ea"
      : "transparent"}; // 활성화된 페이지일 때 보라색 배경
  color: ${(props) =>
    props.isActive ? "white" : "black"}; // 활성화된 페이지일 때 글자색 흰색
  border: none;
  padding: 10px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: ${(props) =>
      props.isActive ? "#3700b3" : "#f0f0f0"}; // hover 시 배경색 변화
  }
`;
const StudentRecordDetail = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const location = useLocation();
  const [review, setReview] = useState([]); // 댓글
  const [inputReview, setInputReview] = useState(""); // 입력 값 상태 관리
  const { item, purchasedFileIds, myUploadedFile, myPurchasedFile } = location.state || {}; // 전달받은 데이터
  // 리뷰 페이지네이션 상태 관리
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [itemsPerPage, setItemsPerPage] = useState(5); // 페이지당 항목 수
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수

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


  useEffect(() => {
    if (item?.fileBoardId) {
      const fetchReview = async () => {
        try {
          const response = await DocumentsApi.getReview(item.fileBoardId, currentPage, itemsPerPage);
          setReview(response.data.content); // 현재 페이지의 리뷰 설정
          setTotalPages(response.data.totalPages); // API 응답을 기준으로 totalPages 설정
        } catch (error) {
          console.error("댓글을 불러오는 중 오류 발생:", error);
        }
      };
      fetchReview();
    }
  }, [item?.fileBoardId, currentPage, inputReview, itemsPerPage]);
  
  // 댓글 저장 함수
  const handleSubmit = async () => {
      if (!inputReview.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }

    try {
      const response = await DocumentsApi.postReview({
        fileBoardId: item.fileBoardId,
        reviewContent: inputReview,
      });

      if (response.status === 200) {
        setReview((prevReview) => [
          ...prevReview,
          { reviewContent: inputReview },
        ]); // UI에 즉시 반영
        setInputReview(""); // 입력창 초기화
      }
    } catch (error) {
      console.error("댓글 저장 중 오류 발생:", error);
      alert("댓글 저장에 실패했습니다.");
    }
  };
  
  // console.log("Selected Item:", item);
  // console.log("Purchased File IDs:", purchasedFileIds);

  const verifyPurchasedFileIds = (item, purchasedFileIds) => {
     // 마이페이지에서 Page전환 했을시 1, TopNavBar에서 Page 전환시 조건문 진행행
     if (myUploadedFile !== 1 && myPurchasedFile !== 1) {
      // purchasedFileIds 배열이 비어 있지 않고 item.fileBoardId와 일치하는 파일 ID가 있는지 확인
      for (let i = 0; i < purchasedFileIds.length; i++) {
        if (item.fileBoardId === purchasedFileIds[i].fileId) {
          // 파일 ID가 일치하면 purchased 값이 true인지 확인하여 true 또는 false 반환
          return purchasedFileIds[0].purchased; // purchased 값이 true이면 true, false이면 false 반환
        }
      }
      return false; // 일치하지 않거나 배열이 비어 있으면 false 반환
    }
    return true;
  };

  // 구매 후 파일 다운로드 로직직
  const handleFileDowloadClick = async (fileUrl) => {
    console.log("Item preview URL:", fileUrl);
    if (!fileUrl) {
      alert("파일 URL이 제공되지 않았습니다.");
      return;
    }

    try {
      const params = {
        fileUrl, // Firebase 파일 URL
        fileName: "", // 파일 이름을 보내지 않음, 백엔드에서 처리
      };

      // 서버에 다운로드 요청
      const response = await DocumentsApi.download(params);

      // 응답 헤더에서 Content-Disposition 읽기
      const contentDisposition = response.headers["content-disposition"];
      console.log("Content-Disposition Header:", contentDisposition); // 로그로 확인

      let fileName = "default_filename"; // 기본 파일 이름 설정

      if (contentDisposition) {
        const matches = contentDisposition.match(
          /filename\*?=["']?([^"']+)["']?/
        );
        if (matches && matches[1]) {
          fileName = decodeURIComponent(matches[1]);
        }
      }

      // Blob 생성 및 다운로드 처리
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName; // 파일 이름 지정
      link.click();
      URL.revokeObjectURL(link.href); // 메모리 해제
    } catch (error) {
      console.error("파일 다운로드 중 오류 발생:", error);
      alert("파일 다운로드에 실패했습니다.");
    }
  };

  const handlePurchaseClick = (productData) => {
    console.log("선택된 상품:", productData);
    // 결제 로직 추가
    const productItem = {
      fileBoardId: productData.fileBoardId, // 상품 ID
      fileTitle: productData.fileTitle, // 상품명명
      univName: productData.univName, // 대학명
      univDept: productData.univDept, // 학과명
      memberName: productData.memberName, // 작성자 이름
      price: productData.price, // 가격
    };
    console.log(productItem);
    // alert(`상품 구매를 진행합니다.\n대학: ${productItem.univName}\n학과: ${productItem.univDept}\n가격: ${productItem.price}원`);

    // CheckOut.js로 이동하며 상품 정보를 전달
    navigate("/checkOutPage", { state: { productItem } });
  };

    // keywords가 배열인지 확인하고, 배열이 아닐 경우 대체 방법 처리
    const formattedKeywords = Array.isArray(item.keywords)
    ? item.keywords
        .map((keyword) => keyword.replace(/[\[\]"\s,]/g, "")) // [ ] " , 공백을 제거
        .join("  ") // 공백 사이에 두 개의 공백을 넣음
    : item.keywords.replace(/[\[\]"\s,]/g, ""); // 문자열일 경우에도 처리

  // 날짜만 추출하는 로직
  const titleDate = (dateTime) => {
    return dateTime ? dateTime.split("T")[0] : "";
  };
  const reviewDateTime = (dateTime) => {
    return dateTime ? dateTime.split("T").join(" ") : "";
  };

  // 자릿수만 포맷팅하는 함수
  const formatPrice = (price) => {
    if (typeof price !== "number") {
      console.warn("Invalid price value:", price);
      return price; // 잘못된 가격 값이 들어오면 원본 반환
    }

    return new Intl.NumberFormat("ko-KR").format(price); // 한국식 천 단위 구분 기호 추가
  };

  // 이름 가운제 * 변경 관련련
  const replaceMiddleName = (str) => {
    if (!str || typeof str !== "string") {
      // str이 falsy(null, undefined, 빈 문자열)거나 문자열이 아닌 경우 기본값 반환
      console.warn("Invalid input for replaceMiddleName:", str);
      return ""; // 기본값으로 빈 문자열 반환
    }
    
    const len = str.length;
    if (len === 0) return str; // 빈 문자열일 경우 원본 반환

    const middleIndex = Math.floor(len / 2); // 가운데 글자 인덱스
    return str.slice(0, middleIndex) + "*" + str.slice(middleIndex + 1); // 가운데 글자를 '*'로 변경
  };

  return (
    <>
      <Background>
        <Top>
          <Title>
            <UnivLogo>
              <img src={item.univImg} alt="" />
            </UnivLogo>
            <DetailBox>
              <DetailBoxTitle>
                {item.univName} {item.univDept} ({item.fileTitle})
              </DetailBoxTitle>
              <DetailBoxInfo>
                <span>{replaceMiddleName(item.memberName)}</span> <span>|</span>
                <span>{titleDate(item.regDate)}</span> <span>|</span>
                <span>{formattedKeywords}</span>
              </DetailBoxInfo>
              <DetailBoxPrice>
                가격: {formatPrice(item.price)}원
                <FileDownloadButton
                  onClick={() => {
                    handleFileDowloadClick(item.preview);
                  }}
                >
                  미리보기
                </FileDownloadButton>
                {verifyPurchasedFileIds(item, purchasedFileIds) && (
                  <FileDownloadButton
                    onClick={() => {
                      handleFileDowloadClick(item.mainFile);
                    }}
                  >
                    다운로드
                  </FileDownloadButton>
                )}
                {!verifyPurchasedFileIds(item, purchasedFileIds) && (
                  <BuyButton
                    $BuyButton
                    onClick={() => handlePurchaseClick(item)}
                  >
                    구매하기
                  </BuyButton>
                )}
              </DetailBoxPrice>
            </DetailBox>
          </Title>
        </Top>
        <Line />
        <Middle>
          <MiddleTitle>자료소개</MiddleTitle>
          <MiddleWrite> {item.summary} </MiddleWrite>
        </Middle>
        <Bottom>
          <BottomTitle>댓글</BottomTitle>
          <BottomContainer>
            <BottomUploadBox>
              <BottomReviewWrite
                type="text"
                value={inputReview}
                onChange={(e) => setInputReview(e.target.value)}
                placeholder="댓글을 입력하세요. (50자 이내)"
                maxLength={50}
              />
              <BottomButton onClick={handleSubmit}>등록</BottomButton>
            </BottomUploadBox>
            
            {/* 리뷰 리스트 렌더링 */}
            {review.length === 0 ? (
              <ReviewListBox>댓글이 없습니다.</ReviewListBox>
            ) : (
              review.map((reviewItem, index) => (
              <ReviewListBox key={index}> 
                <ReviewListTop>
                  <ReviewName>{replaceMiddleName(reviewItem.memberName)}</ReviewName>
                  <ReviewTime>{reviewDateTime(reviewItem.reviewRegDate)}</ReviewTime>
                </ReviewListTop>
                <ReviewListBottom>
                  <ReviewContent>{reviewItem.reviewContent}</ReviewContent>
                </ReviewListBottom>
                <ReviewLine />
              </ReviewListBox>
              ))
            )
            }
          </BottomContainer>
        </Bottom>

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
              isActive={currentPage === startPage + index} // 현재 페이지일 때만 보라색 배경
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
    </>
  );
};


export default StudentRecordDetail;
