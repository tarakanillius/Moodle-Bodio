import React from "react";
import "../styles/login.css";
import {useNavigate} from "react-router-dom";


export default function Login () {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/main");
    };

    return (
        <div className="login-container">
                <div className="body">
                    <div className="container">
                        <div className="content">
                            <h2 className="title">Login</h2>
                            <input
                                type="text"
                                placeholder="Username"
                                className="input"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="input"
                            />
                            <button className="button" onClick={handleLogin}>
                                Accedi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    );
};
