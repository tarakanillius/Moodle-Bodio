import React, {useState, useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "../context/GlobalContext";
import styles from "../styles/login.module.css";

export default function Login() {
    const navigate = useNavigate();
    const { updateUser } = useContext(GlobalContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        if (isLoggedIn) {
            navigate("/main");
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Please enter both email and password");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await axios.post("http://127.0.0.1:5000/login", {
                email: email,
                password: password
            });

            const userDetailsResponse = await axios.get(`http://127.0.0.1:5000/user/${response.data.user_id}`);
            const userData = userDetailsResponse.data.user;

            updateUser({
                id: userData.id,
                name: userData.name,
                surname: userData.surname,
                email: userData.email,
                role: userData.role,
                gender: userData.sex || "male",
            });

            localStorage.setItem("isLoggedIn", "true");

            navigate("/main");
        } catch (error) {
            console.error("Login error:", error);

            if (error.response) {
                if (error.response.status === 404) {
                    setError("User not found. Please check your email.");
                } else if (error.response.status === 401) {
                    setError("Invalid password. Please try again.");
                } else {
                    setError("Login failed: " + (error.response.data.error || "Unknown error"));
                }
            } else if (error.request) {
                setError("No response from server. Please try again later.");
            } else {
                setError("Error: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.body}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <h2 className={styles.title}>Login</h2>

                    {error && (
                        <div className={styles.errorMessage}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            placeholder="Email"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            className={styles.button}
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Accedi"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
