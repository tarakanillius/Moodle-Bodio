import React, { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import styles from "../../styles/settings.module.css";

const NotificationSettings = () => {
    const {notifications, handleNotificationChange, saveStatus, handleSave, backgroundColor, backgroundColor2, textColor,} = useContext(GlobalContext);

    return (
        <div className={styles.settingsSection} style={{ backgroundColor: backgroundColor }}>
            <h2 style={{ color: textColor }}>Impostazioni notifiche</h2>
            <div className={styles.settingItem} style={{ backgroundColor: backgroundColor2 }}>
                <label className={styles.checkboxLabel} style={{ color: textColor }}>
                    <input
                        type="checkbox"
                        checked={notifications.messages}
                        onChange={() => handleNotificationChange("messages")}
                    />
                    Nuovi messaggi
                </label>
            </div>
            <div className={styles.settingItem} style={{ backgroundColor: backgroundColor2 }}>
                <label className={styles.checkboxLabel} style={{ color: textColor }}>
                    <input
                        type="checkbox"
                        checked={notifications.courseUpdates}
                        onChange={() => handleNotificationChange("courseUpdates")}
                    />
                    Aggiornamenti corsi
                </label>
            </div>
            <div className={styles.settingItem} style={{ backgroundColor: backgroundColor2 }}>
                <label className={styles.checkboxLabel} style={{ color: textColor }}>
                    <input
                        type="checkbox"
                        checked={notifications.assignments}
                        onChange={() => handleNotificationChange("assignments")}
                    />
                    Allerta nuove notifiche
                </label>
            </div>
            <div className={styles.settingItem} style={{ backgroundColor: backgroundColor2 }}>
                <label className={styles.checkboxLabel} style={{ color: textColor }}>
                    <input
                        type="checkbox"
                        checked={notifications.announcements}
                        onChange={() => handleNotificationChange("announcements")}
                    />
                    Annunci
                </label>
            </div>
            <div className={styles.settingItem} style={{ backgroundColor: backgroundColor2 }}>
                <label style={{ color: textColor }}>Metodo di notificazione</label>
                <select>
                    <option>Email & In-App</option>
                    <option>Email</option>
                    <option>In-App</option>
                    <option>Non voglio notifiche</option>
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

export default NotificationSettings;
