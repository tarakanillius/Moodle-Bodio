import React, { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import styles from "../../styles/settings.module.css";

const PrivacySettings = () => {
    const {privacySettings, handlePrivacyChange, saveStatus, handleSave, backgroundColor, backgroundColor2, textColor} = useContext(GlobalContext);

    return (
        <div className={styles.settingsSection} style={{ backgroundColor: backgroundColor }}>
            <h2 style={{ color: textColor }}>Privacy Settings</h2>
            <div className={styles.settingItem} style={{ backgroundColor: backgroundColor2 }}>
                <label className={styles.checkboxLabel} style={{ color: textColor }}>
                    <input
                        type="checkbox"
                        checked={privacySettings.profileVisible}
                        onChange={(e) => handlePrivacyChange("profileVisible", e.target.checked)}
                    />
                    Consentire che il profilo sia visibile ad altri utenti
                </label>
            </div>
            <div className={styles.settingItem} style={{ backgroundColor: backgroundColor2 }}>
                <label className={styles.checkboxLabel} style={{ color: textColor }}>
                    <input
                        type="checkbox"
                        checked={privacySettings.showOnlineStatus}
                        onChange={(e) => handlePrivacyChange("showOnlineStatus", e.target.checked)}
                    />
                    Mostra stato online
                </label>
            </div>
            <div className={styles.settingItem} style={{ backgroundColor: backgroundColor2 }}>
                <label className={styles.checkboxLabel} style={{ color: textColor }}>
                    <input
                        type="checkbox"
                        checked={privacySettings.allowDataCollection}
                        onChange={(e) => handlePrivacyChange("allowDataCollection", e.target.checked)}
                    />
                    Consentire la raccolta di dati per il miglioramento del servizio
                </label>
            </div>
            <div className={styles.settingItem} style={{ backgroundColor: backgroundColor2 }}>
                <label style={{ color: textColor }}>Condivisione dati</label>
                <select
                    value={privacySettings.dataSharing}
                    onChange={(e) => handlePrivacyChange("dataSharing", e.target.value)}
                >
                    <option>Minimi (solo necessari)</option>
                    <option>Standard</option>
                    <option>Accesso completo</option>
                </select>
            </div>
            <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={handleSave}>
                    Salvare
                </button>
                <button className={styles.button}>
                    Richiedi l'esportazione dei dati
                </button>
            </div>
            {saveStatus && <p>{saveStatus}</p>}
        </div>
    );
};

export default PrivacySettings;
