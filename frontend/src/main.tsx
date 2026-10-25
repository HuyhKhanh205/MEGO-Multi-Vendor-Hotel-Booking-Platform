import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import App from "./App";
import "./i18n";
import "./index.css";
import store from "./stores/store";
import { logout } from "./stores/authSlice";
import { setUnauthorizedHandler } from "./services/apiClient";
import { ThemeProvider } from "./contexts/ThemeContext";

// Token hết hạn / không hợp lệ → tự động đăng xuất
setUnauthorizedHandler(() => store.dispatch(logout()));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
