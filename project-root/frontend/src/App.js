import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Main from "./pages/Main";
import { GlobalContext, GlobalProvider } from "./context/GlobalContext";
import Quiz from "./pages/Quiz";

const AuthCheck = ({ children }) => {
    const { isAuthenticated, loading } = useContext(GlobalContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, loading, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : null;
};

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useContext(GlobalContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const LoginRoute = () => {
    const { isAuthenticated, loading } = useContext(GlobalContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Navigate to="/" replace /> : <Login />;
};

export default function App() {
    return (
        <GlobalProvider>
            <Router>
                <AuthCheck>
                </AuthCheck>
                <Routes>
                    <Route path="/login" element={<LoginRoute />} />
                    <Route
                        path="/*"
                        element={
                            <ProtectedRoute>
                                <Main />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/quiz"
                        element={
                            <ProtectedRoute>
                                <Quiz />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </GlobalProvider>
    );
}
