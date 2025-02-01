import {Outlet, useLocation, useNavigate} from "react-router-dom";
import styled from "styled-components";
import DocumentsApi from "../../api/DocumentsApi";
import ChattingApi from "../../api/ChattingApi";
import React, {useContext, useState} from "react";
import {ChatContext} from "../../context/ChatStore";
import ChatList from "../../component/ChatComponent/ChatList";
import OpenChatSearch from "../../component/ChatComponent/OpenChatSearch";
import ChatBot from "../../component/ChatComponent/ChatBot";
import Chatting from "../../component/ChatComponent/Chatting";
import ChatRoomCreate from "../../component/ChatComponent/ChatRoomCreate";
import openIcon from "../../images/chat.png";
import closeIcon from "../../images/close.png";
import ChatMenuBar from "../../component/ChatComponent/ChatMenuBar";
import {Container, StyledSideMenu} from "../chat/ChatModal";

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
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
`;

const Middle = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MiddleTitle = styled.div`
  width: 100%;
  margin-left: 10%;
  margin-right: 10%;
  padding-left: 10%;
  padding-right: 10%;
  margin-top: 3%;
  font-size: clamp(1.2rem, 1.4vw, 2.5rem);
`;

const MiddleWrite = styled.div`
  width: 100%;
  margin-left: 10%;
  margin-right: 10%;
  padding-left: 10%;
  padding-right: 10%;
  margin-top: 3%;
  white-space: normal; /* 기본적인 줄바꿈 허용 */
  word-wrap: break-word; /* 긴 단어도 자동으로 줄바꿈 */
  overflow-wrap: break-word; /* 텍스트가 박스를 넘지 않도록 자동으로 줄바꿈 */
  word-break: break-word; /* 단어가 박스를 넘으면 줄바꿈 */
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





const PrivateChat = styled.button`
    
`

const PersonalStatementDetail = ({ setSelectedPage }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const {setRoomId} = useContext(ChatContext);

  const [filteredChatRooms, setFilteredChatRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태

  const [personCnt, setPersonCnt] = useState([]);
  const [chatRoomTitle, setChatRoomTitle] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const location = useLocation();
  const { item, purchasedFileIds, myUploadedFile, myPurchasedFile } = location.state || {}; // 전달받은 데이터
  if (!item) {
    return <div>데이터가 없습니다.</div>;
  }

  console.log("Selected Item:", item);
  console.log("Purchased File IDs:", purchasedFileIds);

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

  // keywords가 배열인지 확인하고, 배열이 아닐 경우 대체 방법 처리
  const formattedKeywords = Array.isArray(item.keywords)
    ? item.keywords
        .map((keyword) => keyword.replace(/[\[\]"\s,]/g, "")) // [ ] " , 공백을 제거
        .join("  ") // 공백 사이에 두 개의 공백을 넣음
    : item.keywords.replace(/[\[\]"\s,]/g, ""); // 문자열일 경우에도 처리

  // 날짜만 추출하는 로직
  const formattedDate = item.regDate ? item.regDate.split("T")[0] : "";

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

  // 자릿수만 포맷팅하는 함수
  const formatPrice = (price) => {
    if (typeof price !== "number") {
      console.warn("Invalid price value:", price);
      return price; // 잘못된 가격 값이 들어오면 원본 반환
    }

    return new Intl.NumberFormat("ko-KR").format(price); // 한국식 천 단위 구분 기호 추가
  };

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
                <span>{replaceMiddleChar(item.memberName)}</span> <span>|</span>
                <span>{formattedDate}</span> <span>|</span>
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
      </Background>
    </>
  );
};

export default PersonalStatementDetail;
