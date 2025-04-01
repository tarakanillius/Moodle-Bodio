import React from "react";
import styles from "../styles/login.module.css";
import {useNavigate} from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/main");
    };

    return (
        <div className={styles.body}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <h2 className={styles.title}>Login</h2>
                    <input
                        type="text"
                        placeholder="Username"
                        className={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className={styles.input}
                    />
                    <button className={styles.button} onClick={handleLogin}>
                        Accedi
                    </button>
                </div>
            </div>
        </div>
    );
};
