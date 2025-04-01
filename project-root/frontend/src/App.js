import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Quiz from "./pages/Quiz"; 
import Home from "./pages/Home";
import Main from "./pages/Main";

export default function App() {
  return (
      <Router>
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/main" element={<Main />} />
            <Route path="/home" element={<Home/>} />
            <Route path="/quiz" element={<Quiz />} />
        </Routes>
      </Router>
  );
}

