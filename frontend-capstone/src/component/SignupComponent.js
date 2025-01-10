import styled, { css } from "styled-components";

// 공통 컨테이너 스타일
export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  max-width: 500px;
  margin: auto;

  .footer {
    display: flex;
    position: absolute;
    background-color: #ccc;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30px;
    color: #222;
    font-size: 0.8em;
    justify-content: center;
    align-items: center;
  }
`;

// Items 스타일 컴포넌트 개선
export const Items = styled.div`
  display: flex;
  align-items: center;
  margin: ${(props) => props.margin || "10px"};
  justify-content: ${(props) => props.justify || "flex-start"};
  font-size: ${(props) => props.fontSize || "inherit"};
  color: ${(props) => props.color || "inherit"};

  ${(props) =>
    props.variant === "sign" &&
    css`
      font-size: 30px;
      margin-top: 100px;
      margin-bottom: 40px;
      justify-content: center;
    `}

  ${(props) =>
    props.variant === "hint" &&
    css`
      margin-top: -5px;
      margin-bottom: 10px;
      justify-content: flex-end;
      font-size: 12px;
      color: #999;
    `}

  ${(props) =>
    props.variant === "signup" &&
    css`
      justify-content: flex-end;
      color: orange;
      font-weight: 700;
      margin-top: 10px;
      margin-right: 40px;
      font-size: 14px;

      .link_style {
        color: orange;
        text-decoration: none;
      }
    `}
`;
