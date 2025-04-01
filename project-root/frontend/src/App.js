import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login"; // Assicurati che il percorso sia corretto

function App() {
  return (
      <Router>
        <Routes>
          {/* La pagina di login sarà la prima visualizzata */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
  );
}

export default App;
