
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// IMPORTANT CSS imports 
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./scss/custom.scss"; //

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
