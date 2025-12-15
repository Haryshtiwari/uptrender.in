import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CustomizerContextProvider } from "./components/context/CustomizerContext";
import { AuthProvider } from "./app/AuthProvider";
import ErrorBoundary from "./components/common/ErrorBoundary";
import ToastProvider from "./contexts/ToastContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <CustomizerContextProvider>
          <BrowserRouter>
            <AuthProvider>
              <ToastProvider>
                <App />
              </ToastProvider>
            </AuthProvider>
          </BrowserRouter>
        </CustomizerContextProvider>
      </ErrorBoundary>
    </HelmetProvider>
  </React.StrictMode>
);
