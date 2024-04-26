import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RequestPassword from "./pages/RequestPassword.jsx";
import EnterPassword from "./pages/login.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/req-password" element={<RequestPassword />} />
          <Route path="/login" element={<EnterPassword />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
