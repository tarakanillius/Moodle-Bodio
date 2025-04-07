import React, { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import styles from "../../styles/settings.module.css";

const GeneralSettings = () => {
    const {theme, setTheme, language, setLanguage, saveStatus, handleSave} = useContext(GlobalContext);

    return (
        <div className={styles.settingsSection}>
            <h2 style={{ color: theme === "Dark" ? "#ffffff" : "#000000" }}>General Settings</h2>
            <div className={styles.settingItem}>
                <div className={styles.settingItem}>
                    <label style={{ color: theme === "Dark" ? "#ffffff" : "#000000" }}>Indirizzo email</label>
                    <input type="email" value="mario.rossi@example.com" disabled />
                </div>
                <div className={styles.settingItem}>
                    <label style={{ color: theme === "Dark" ? "#ffffff" : "#000000" }}>Informazioni account</label>
                    <input
                        type="text"
                        value="Mario Rossi registered 12.01.2024 by Admin123"
                        disabled
                    />
                </div>
                <label style={{ color: theme === "Dark" ? "#ffffff" : "#000000" }}>Tema</label>
                <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                    <option>Light</option>
                    <option>Dark</option>
                    <option>System Default</option>
                </select>
            </div>
            <div className={styles.settingItem}>
                <label style={{ color: theme === "Dark" ? "#ffffff" : "#000000" }}>Lingua</label>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    <option>Inglese</option>
                    <option>Italiano</option>
                    <option>Francese</option>
                    <option>Tedesco</option>
                </select>
            </div>
            <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={handleSave}>
                    Salvare
                </button>
            </div>
            {saveStatus && <p>{saveStatus}</p>}
        </div>
    );
};

export default GeneralSettings;
