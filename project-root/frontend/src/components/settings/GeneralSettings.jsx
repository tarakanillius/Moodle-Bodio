import React, { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import styles from "../../styles/settings.module.css";

const GeneralSettings = () => {
    const {backgroundColor, backgroundColor2, textColor, theme, setTheme, language, setLanguage} = useContext(GlobalContext);

    const handleChangeTheme = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };
    return (
        <div className={styles.settingsSection} style={{ backgroundColor: backgroundColor }}>
            <h2 style={{ color: textColor }}>General Settings</h2>
                <div className={styles.settingItem} style={{ backgroundColor: backgroundColor2 }}>
                    <label style={{ color: textColor }}>Indirizzo email</label>
                    <input type="email" value="mario.rossi@example.com" disabled />
                </div>
                <div className={styles.settingItem} style={{ backgroundColor: backgroundColor2 }}>
                    <label style={{ color: textColor }}>Informazioni account</label>
                    <input
                        type="text"
                        value="Mario Rossi registered 12.01.2024 by Admin123"
                        disabled
                    />
                </div>
                <div className={styles.settingItem} style={{backgroundColor: backgroundColor2}}>
                    <label style={{color: textColor}}>Tema</label>
                    <select value={theme} onChange={(e) => handleChangeTheme(e.target.value)}>
                        <option>Light</option>
                        <option>Dark</option>
                        <option>System Default</option>
                    </select>
                </div>
            <div className={styles.settingItem} style={{backgroundColor: backgroundColor2}}>
                <label style={{color: textColor}}>Lingua</label>
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
        </div>
    );
};

export default GeneralSettings;
