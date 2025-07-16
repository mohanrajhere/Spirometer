import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import SpiroMeter from "./components/SpiroMeter";
import { FormPage } from "./components/FormPage";
import { Login } from "./components/Login";
import { SignUp } from "./components/SignUp";

const RedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      navigate("/spiro"); // Redirect to SpiroMeter if already logged in
    } else {
      navigate("/"); // Otherwise go to Login
    }
  }, [navigate]);

  return null;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/r" element={<RedirectHandler />} />
        <Route path="/" element={<Login />} />
        <Route path="/sign" element={<SignUp />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/spiro" element={<SpiroMeter />} />
      </Routes>
    </Router>
  );
}

export default App;
