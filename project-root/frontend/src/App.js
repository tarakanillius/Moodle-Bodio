import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Main from "./pages/Main";
import GlobalProvider from "./context/GlobalContext";
import Quiz from "./pages/Quiz";

const ProtectedRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default function App() {
    return (
        <GlobalProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/*"
                        element={
                            <ProtectedRoute>
                                <Main />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/quiz" element={<Quiz/>} />
                </Routes>
            </Router>
        </GlobalProvider>
    );
}
