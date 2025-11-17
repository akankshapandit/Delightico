import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
// REMOVE this import - AuthProvider is already in App.jsx
// import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App /> {/* AuthProvider is already inside App */}
    </BrowserRouter>
  </React.StrictMode>
);