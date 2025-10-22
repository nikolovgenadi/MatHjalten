import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { AdsProvider } from "./contexts/AdsContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <AdsProvider>
        <App />
      </AdsProvider>
    </AuthProvider>
  </StrictMode>
);
