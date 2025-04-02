import React, { useState } from "react";
import styles from "../styles/userData.module.css";

export default function UserData() {

    const [user, setUser] = useState({
        name: "Mario",
        surname: "Rossi",
        gender: "male",
        birthDate: "2007-05-17",
        email: "mariorossi@gmail.com",
        password: "pw1234",
        role: "teacher"
    });

    // Stato per gestire la modalità modifica
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Funzione per gestire i cambiamenti nei campi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    return (
        <div className={styles.userDataContainer}>
            <h2>Il Mio Profilo</h2>
            <p>Modifica le tue informazioni personali.</p>

            <div className={`${styles.data} ${isEditing ? styles.editable : ""}`}>
                <div className={styles.info}>
                    <label>Nome:</label>
                    <input type="text" name="name" value={user.name} onChange={handleChange} disabled={!isEditing}/>
                </div>

                <div className={styles.info}>
                    <label>Cognome:</label>
                    <input type="text" name="surname" value={user.surname} onChange={handleChange}
                           disabled={!isEditing}/>
                </div>

                <div className={styles.info}>
                    <label>Genere:</label>
                    <select name="gender" value={user.gender} onChange={handleChange} disabled={!isEditing}>
                        <option value="male">Maschio</option>
                        <option value="female">Femmina</option>
                        <option value="other">Altro</option>
                    </select>
                </div>

                <div className={styles.info}>
                    <label>Data di nascita:</label>
                    <input type="date" name="birthDate" value={user.birthDate} onChange={handleChange}
                           disabled={!isEditing}/>
                </div>

                <div className={styles.info}>
                    <label>Email:</label>
                    <input type="email" name="email" value={user.email} onChange={handleChange} disabled={!isEditing}/>
                </div>

            </div>

            {/* Bottone per attivare la modifica */}
            <button className={styles.editButton} onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Salva" : "Modifica"}
            </button>
        </div>
    );
}
