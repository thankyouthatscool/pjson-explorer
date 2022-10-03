import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";

import { App } from "./App";
import { store } from "./store";
import { GlobalStyle } from "./theme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <GlobalStyle />
      <App />
    </ReduxProvider>
  </React.StrictMode>
);
