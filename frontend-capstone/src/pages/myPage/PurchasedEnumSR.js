import styled from "styled-components";

const Background = styled.div`
  width: 80%;
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
`;

const ItemBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ItemTitle = styled.div`
  width: 100%;
`;

const ItemPrice = styled.div`
  width: 100%;
`;

const ItemDate = styled.div`
  width: 100%;
`;

const PurchasedEnumSR = () => {
  return(
    <>
      <Background>
        <ContainerBox>
          <Title>구매한 활기록부</Title>
          <ItemBox>
            <ItemTitle>상품명</ItemTitle>
            <ItemPrice>상품금액</ItemPrice>
            <ItemDate>구매일자</ItemDate>
          </ItemBox>
        </ContainerBox>
      </Background>
    </>
  )
}

export default PurchasedEnumSR;