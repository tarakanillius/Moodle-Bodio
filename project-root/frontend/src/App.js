import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login"; // Assicurati che il percorso sia corretto
import Quiz from "./pages/Quiz";

function App() {
  return (
      <Router>
        <Routes>
          {}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/quiz" element={<Quiz />} />
        </Routes>
      </Router>
  );
}

export default App;
