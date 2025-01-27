import styled from "styled-components";
import {Title} from "../../pages/categoryEnumPS/PersonalStatementWrite";

const Bg = styled.div`
  width: 30%;
  height: 1000px;
  background-color: skyblue;
`

const BuyPS = () => {
    return(
        <>
            <Bg>
                <Title>구매한 자기소개서</Title>
            </Bg>
        </>
    );
};
export default BuyPS;