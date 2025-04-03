import React, { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import styles from "../../styles/settings.module.css";

const NotificationSettings = () => {
    const {notifications, handleNotificationChange, saveStatus, handleSave} = useContext(GlobalContext);

    return (
        <div className={styles.settingsSection}>
            <h2>Notification Settings</h2>
            <div className={styles.settingItem}>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={notifications.messages}
                        onChange={() => handleNotificationChange("messages")}
                    />
                    New Messages
                </label>
            </div>
            <div className={styles.settingItem}>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={notifications.courseUpdates}
                        onChange={() => handleNotificationChange("courseUpdates")}
                    />
                    Course Updates
                </label>
            </div>
            <div className={styles.settingItem}>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={notifications.assignments}
                        onChange={() => handleNotificationChange("assignments")}
                    />
                    New Assignment Alerts
                </label>
            </div>
            <div className={styles.settingItem}>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={notifications.announcements}
                        onChange={() => handleNotificationChange("announcements")}
                    />
                    Announcements
                </label>
            </div>
            <div className={styles.settingItem}>
                <label>Notification Method</label>
                <select>
                    <option>Email & In-App</option>
                    <option>Email Only</option>
                    <option>In-App Only</option>
                    <option>None</option>
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
