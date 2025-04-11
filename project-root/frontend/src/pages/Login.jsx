import React, { useState, useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { login } from '../handlers/userHandlers';
import styles from '../styles/login.module.css';

export default function Login() {
    const { updateUser, BACKEND_URL } = useContext(GlobalContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(BACKEND_URL, email, password);

        if (result.success) {
            updateUser(result.user, result.token);
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <div className={styles.logoContainer}>
                    <img src="/assets/logo_ameti.jpeg" alt="Logo" className={styles.logo} />
                </div>

                <h1 className={styles.title}>Login</h1>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.loginButton}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}

