import React, { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import styles from "../../styles/settings.module.css";

const GeneralSettings = () => {
    const {backgroundColor2, textColor, darkMode, toggleDarkMode, language, setLanguage} = useContext(GlobalContext);

    const handleChangeTheme = (value) => {
        const isDarkMode = value === "Dark";
        if (isDarkMode !== darkMode) {
            toggleDarkMode();
        }
    };

    return (
        <div className={styles.settingSection} style={{backgroundColor: backgroundColor2}}>
            <h2 style={{backgroundColor: backgroundColor2, color: textColor }}>General Settings</h2>
                <div className={styles.settingItem} style={{ backgroundColor: backgroundColor2 }}>
                    <label style={{ backgroundColor: backgroundColor2, color: textColor }}>Indirizzo email</label>
                    <input style={{ backgroundColor: backgroundColor2}} type="email" value="mario.rossi@example.com" disabled />
                </div>
                <div className={styles.settingItem} style={{ backgroundColor: backgroundColor2 }}>
                    <label style={{ color: textColor }}>Informazioni account</label>
                    <input
                        style={{ backgroundColor: backgroundColor2}}
                        type="text"
                        value="Mario Rossi registered 12.01.2024 by Admin123"
                        disabled
                    />
                </div>
                <div className={styles.settingItem} style={{backgroundColor: backgroundColor2}}>
                    <label style={{color: textColor}}>Tema</label>
                    <select style={{ backgroundColor: backgroundColor2, color: textColor}}  value={darkMode? "Dark" : "Light"} onChange={(e) => handleChangeTheme(e.target.value)}>
                        <option>Light</option>
                        <option>Dark</option>
                    </select>
                </div>
            <div className={styles.settingItem} style={{backgroundColor: backgroundColor2}}>
                <label style={{color: textColor}}>Lingua</label>
                <select
                    style={{ backgroundColor: backgroundColor2, color: textColor}}
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    <option>Inglese</option>
                    <option>Italiano</option>
                    <option>Francese</option>
                    <option>Tedesco</option>
                </select>
            </div>
        </div>
    );
};

export default GeneralSettings;
