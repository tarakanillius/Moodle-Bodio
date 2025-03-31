import React from "react";
import "../styles/login.css";


const Login = () => {
    return (
        <div className="body">
            <div className="container">
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
                <button className="button">
                    Accedi
                </button>
            </div>
        </div>
    );
};

export default Login;