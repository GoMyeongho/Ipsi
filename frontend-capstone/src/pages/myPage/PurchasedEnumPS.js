import styled from "styled-components";
import { useState, useEffect } from "react";
import MyPageApi from "../../api/MyPageApi";

const Background = styled.div`
  width: 100%;
  height: 100%;
`;

const ContainerBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.div`
  width: 100%;
  margin-bottom: 3%;
  font-size: clamp(1.1rem, 1.8vw, 1.8rem);  /* 최소 1rem, 기본 1.5vw, 최대 2rem */
  font-weight: bold;
`;

const ItemBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SortingBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ItemTitle = styled.div`
  width: 100%;
  height: 5vh;
  font-size: clamp(0.8rem, 1.8vw, 1.5rem);  /* 최소 1rem, 기본 1.5vw, 최대 2rem */
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  text-align: center;
  background-color: lavender;
`;

const ItemPrice = styled.div`
  width: 100%;
  height: 5vh;
  font-size: clamp(0.8rem, 1.8vw, 1.5rem);  /* 최소 1rem, 기본 1.5vw, 최대 2rem */
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  text-align: center;
  background-color: lavender;
`;

const ItemDate = styled.div`
  width: 100%;
  height: 5vh;
  font-size: clamp(0.8rem, 1.8vw, 1.5rem);  /* 최소 1rem, 기본 1.5vw, 최대 2rem */
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  text-align: center;
  background-color: lavender;
`;

const ItemRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid #ccc; /* 행 사이 구분선 */
  padding: 10px 0;
`;

const ItemColumn = styled.div`
  width: 33%;
  font-size: clamp(0.8rem, 1.5vw, 1.2rem);  /* 최소 1rem, 기본 1.5vw, 최대 2rem */
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const PurchasedEnumPS = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // 데이터를 가져오는 함수
    const fetchItems = async () => {
      try {
        const response = await MyPageApi.PurchasedEnumPSItem("PERSONAL_STATEMENT"); // 카테고리 필터 추가
        const data = response.data;
        console.log(data);
        setItems(data);
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      }
    };
  
    fetchItems();
  }, []);
    
  // 금액 형식 변경 함수
  const formatPrice = (price) => {
    return price.toLocaleString() + '원';
  };

  // 날짜 형식 변경 함수 (년-월-일 시:분)
  const formatDate = (date) => {
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${hours}:${minutes}`;
  };

  return (
    <Background>
      <ContainerBox>
        <Title>구매한 자기소개서</Title>
        <ItemBox>
          <SortingBox>
            <ItemTitle>상품명</ItemTitle>
            <ItemPrice>상품금액</ItemPrice>
            <ItemDate>구매일자</ItemDate>
          </SortingBox>
          {/* 데이터를 반복 렌더링 */}
          {items.map((item, index) => (
            <ItemRow key={index}>
              <ItemColumn>{item.univName}{" "}{item.univDept}{" "}({item.fileTitle})</ItemColumn>
              <ItemColumn>{formatPrice(item.price)}</ItemColumn>
              <ItemColumn>{formatDate(item.purchaseDate)}</ItemColumn>
            </ItemRow>
          ))}
        </ItemBox>
      </ContainerBox>
    </Background>
  );
};

export default PurchasedEnumPS;
