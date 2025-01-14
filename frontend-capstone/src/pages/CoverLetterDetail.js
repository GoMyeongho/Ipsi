import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
  img {
    width: 50%; // 원하는 크기로 비율을 설정하거나 px 값으로 설정할 수 있습니다
    height: auto; // 자동으로 비율에 맞게 높이를 조정
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
`;

const DetailBoxInfo = styled.div`
  width: 100%;
  margin-top: 3%;
`;

const DetailBoxPrice = styled.div`
width: 100%;
margin-top: 3%;
display: flex;
flex-direction: row;
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
  width: 60%;
  margin-top: 3%;
`;

const MiddleWrite = styled.div`
  width: 60%;
  margin-top: 3%;
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

const CoverLetterDetail = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const location = useLocation();
  const { item } = location.state || {}; // 전달받은 데이터
  console.log(item)
  if (!item) {
    return <div>데이터가 없습니다.</div>;
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
  return (
    <>
      <Background>
        <Top>
          <Title>
            <UnivLogo>
            <img src={item.univImg} alt="" />
            </UnivLogo>
            <DetailBox>
              <DetailBoxTitle>{item.univName} {item.univDept} {item.title}</DetailBoxTitle>
              <DetailBoxInfo>{item.memberName} | {item.regDate} | </DetailBoxInfo>
              <DetailBoxPrice>
              <p>{item.price}원</p>
                <button>미리보기</button>
                <BuyButton BuyButton onClick={() => handlePurchaseClick(item)}>
                  구매하기
                </BuyButton>
              </DetailBoxPrice>
            </DetailBox>
          </Title>
        </Top>
        <Line />
        <Middle>
          <MiddleTitle>자료소개</MiddleTitle>
          <MiddleWrite>
            {item.introduction}
          </MiddleWrite>
        </Middle>
      </Background>
    </>
  );
};

export default CoverLetterDetail;
