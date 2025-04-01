import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Quiz from "./pages/Quiz"; 
import Home from "./pages/Home";

function App() {
  return (
      <Router>
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home/>} />
            <Route path="/quiz" element={<Quiz />} />
        </Routes>
      </Router>
  );
}

export default App;
