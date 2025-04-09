import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "../context/GlobalContext";
import styles from "../styles/userData.module.css";

export default function UserData() {
    const navigate = useNavigate();
    const { updateUser, clearUser, theme, BACKEND_URL} = useContext(GlobalContext);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [userData, setUserData] = useState({
        name: "",
        surname: "",
        gender: "",
        birthDate: "",
        role: ""
    });

    useEffect(() => {
        const checkAuth = async () => {
            const isLoggedIn = localStorage.getItem("isLoggedIn");
            const userId = localStorage.getItem("userId");
            if (!isLoggedIn || !userId) {
                navigate("/login");
                return;
            }
            try {
                setLoading(true);
                const response = await axios.get(`${BACKEND_URL}/user/${userId}`);
                let formattedBirthDate = "";
                if (response.data.user.birth) formattedBirthDate = response.data.user.birth.split('T')[0];
                setUserData({
                    name: response.data.user.name || "",
                    surname: response.data.user.surname || "",
                    gender: response.data.user.sex || "male",
                    birthDate: formattedBirthDate,
                    role: response.data.user.role || ""
                });
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError("Failed to load user data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem("userId");
            if (!userId) {
                setError("User not authenticated");
                return;
            }
            await axios.put(`${BACKEND_URL}/update_user/${userId}`, {
                name: userData.name,
                surname: userData.surname,
                sex: userData.gender,
                birth: userData.birthDate,
            });
            updateUser({
                id: userId,
                name: userData.name,
                surname: userData.surname,
                role: userData.role,
                gender: userData.gender,
            });
            setSuccessMessage("Profile updated successfully");
            setIsEditing(false);
            setTimeout(() => {setSuccessMessage("");}, 3000);
        }  catch (error) {
            console.error("Error updating user data:", error);
            setError("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        clearUser();
        navigate("/login");
    };

    const toggleEditMode = () => {
        if (isEditing) handleSave();
        setIsEditing(true)
    };

    if (loading) return <div className={styles.loadingMessage}>Loading user data...</div>;

    return (
        <div className={styles.userDataContainer} style={{ backgroundColor: theme === "Dark" ? "#1a1a1a" : "#ffffff" }}>
            <div className={styles.titleContainer}>
                <h2 style={{ color: theme === "Dark" ? "#ffffff" : "#333333" }}>Il Mio Profilo</h2>
                <p style={{ color: theme === "Dark" ? "#bbbbbb" : "#666666" }}>
                    Modifica le tue informazioni personali.
                </p>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

            <div className={`${styles.data} ${isEditing ? styles.editable : ""}`}
                 style={{ backgroundColor: theme === "Dark" ? "#2d2d2d" : isEditing ? "#f0f7ff" : "#f9f9f9" }}>
                <div className={styles.fieldGroup}>
                    <label style={{ color: theme === "Dark" ? "#ffffff" : "#333333" }}>Nome:</label>
                    <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        style={{
                            backgroundColor: theme === "Dark"
                                ? (isEditing ? "#3d3d3d" : "#2d2d2d")
                                : (isEditing ? "#ffffff" : "#f2f2f2"),
                            color: theme === "Dark" ? "#ffffff" : "#333333",
                            borderColor: theme === "Dark" ? "#555555" : "#dddddd"
                        }}
                    />
                </div>

                <div className={styles.fieldGroup}>
                    <label style={{ color: theme === "Dark" ? "#ffffff" : "#333333" }}>Cognome:</label>
                    <input
                        type="text"
                        name="surname"
                        value={userData.surname}
                        onChange={handleChange}
                        disabled={!isEditing}
                        style={{
                            backgroundColor: theme === "Dark"
                                ? (isEditing ? "#3d3d3d" : "#2d2d2d")
                                : (isEditing ? "#ffffff" : "#f2f2f2"),
                            color: theme === "Dark" ? "#ffffff" : "#333333",
                            borderColor: theme === "Dark" ? "#555555" : "#dddddd"
                        }}
                    />
                </div>

                <div className={styles.fieldGroup}>
                    <label style={{ color: theme === "Dark" ? "#ffffff" : "#333333" }}>Genere:</label>
                    <select
                        name="gender"
                        value={userData.gender}
                        onChange={handleChange}
                        disabled={!isEditing}
                        style={{
                            backgroundColor: theme === "Dark"
                                ? (isEditing ? "#3d3d3d" : "#2d2d2d")
                                : (isEditing ? "#ffffff" : "#f2f2f2"),
                            color: theme === "Dark" ? "#ffffff" : "#333333",
                            borderColor: theme === "Dark" ? "#555555" : "#dddddd"
                        }}
                    >
                        <option value="male">Maschio</option>
                        <option value="female">Femmina</option>
                        <option value="other">Altro</option>
                    </select>
                </div>

                <div className={styles.fieldGroup}>
                    <label style={{ color: theme === "Dark" ? "#ffffff" : "#333333" }}>Data di nascita:</label>
                    <input
                        type="date"
                        name="birthDate"
                        value={userData.birthDate}
                        onChange={handleChange}
                        disabled={!isEditing}
                        style={{
                            backgroundColor: theme === "Dark"
                                ? (isEditing ? "#3d3d3d" : "#2d2d2d")
                                : (isEditing ? "#ffffff" : "#f2f2f2"),
                            color: theme === "Dark" ? "#ffffff" : "#333333",
                            borderColor: theme === "Dark" ? "#555555" : "#dddddd"
                        }}
                    />
                </div>

                <div className={styles.fieldGroup}>
                    <label style={{ color: theme === "Dark" ? "#ffffff" : "#333333" }}>Ruolo:</label>
                    <input
                        type="text"
                        value={userData.role}
                        disabled
                        style={{
                            backgroundColor: theme === "Dark" ? "#2d2d2d" : "#f2f2f2",
                            color: theme === "Dark" ? "#bbbbbb" : "#777777",
                            borderColor: theme === "Dark" ? "#555555" : "#dddddd"
                        }}
                    />
                </div>
            </div>

            <div className={styles.buttonContainer}>
                <button
                    className={styles.editButton}
                    onClick={toggleEditMode}
                    disabled={loading}
                >
                    {isEditing ? "Salva" : "Modifica"}
                </button>

                <button
                    className={styles.logoutButton}
                    onClick={handleLogout}
                >
                    Disconnetti
                </button>
            </div>
        </div>
    );
}
