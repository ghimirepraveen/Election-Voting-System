import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

try {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <Navbar />
      <App />
      <Footer />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Error rendering React application:", error);
}
