import styled, { createGlobalStyle } from "styled-components";
const GlobalStyle = createGlobalStyle`

  * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

`;

export const BackGround = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default GlobalStyle;
