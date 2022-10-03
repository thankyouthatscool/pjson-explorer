import { createGlobalStyle } from "styled-components";
import { normalize } from "styled-normalize";

export const GlobalStyle = createGlobalStyle`
  ${normalize};

  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    font-size: 16px;

    height: 100%;

    margin: 0;

    padding: 0;

    width: 100%;
  }
`;
