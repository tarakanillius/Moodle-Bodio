import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "../context/GlobalContext";
import styles from "../styles/userData.module.css";

export default function UserData() {
    const navigate = useNavigate();
    const { updateUser, clearUser } = useContext(GlobalContext);

    const [userData, setUserData] = useState({
        name: "",
        surname: "",
        gender: "",
        birthDate: "",
        role: ""
    });

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");


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
                const response = await axios.get(`http://127.0.0.1:5000/user/${userId}`);

                let formattedBirthDate = "";
                if (response.data.user.birth) {
                    formattedBirthDate = response.data.user.birth.split('T')[0];
                }

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

            await axios.put(`http://127.0.0.1:5000/update_user/${userId}`, {
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

            setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
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
        if (isEditing) {
            handleSave();
        } else {
            setIsEditing(true);
        }
    };

    if (loading) {
        return <div className={styles.loadingMessage}>Loading user data...</div>;
    }

    return (
        <div className={styles.userDataContainer}>
            <div className={styles.titleContainer}>
                <h2>Il Mio Profilo</h2>
                <p>Modifica le tue informazioni personali.</p>
            </div>
            {error && <div className={styles.errorMessage}>{error}</div>}
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

            <div className={`${styles.data} ${isEditing ? styles.editable : ""}`}>
                <label>Nome:</label>
                <input type="text" name="name" value={userData.name} onChange={handleChange} disabled={!isEditing} />

                <label>Cognome:</label>
                <input type="text" name="surname" value={userData.surname} onChange={handleChange} disabled={!isEditing} />

                <label>Genere:</label>
                <select name="gender" value={userData.gender} onChange={handleChange} disabled={!isEditing}>
                    <option value="male">Maschio</option>
                    <option value="female">Femmina</option>
                    <option value="other">Altro</option>
                </select>

                <label>Data di nascita:</label>
                <input type="date" name="birthDate" value={userData.birthDate} onChange={handleChange} disabled={!isEditing} />

                <label>Ruolo:</label>
                <input type="text" value={userData.role} disabled />
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
