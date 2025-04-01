import React from "react";
import styles from "../../styles/settings.module.css";

const SettingsNav = ({ activeTab, setActiveTab }) => {
    return (
        <nav className={styles.settingsNav}>
            <button
                className={activeTab === "general" ? styles.active : ""}
                onClick={() => setActiveTab("general")}
            >
                General
            </button>
            <button
                className={activeTab === "notifications" ? styles.active : ""}
                onClick={() => setActiveTab("notifications")}
            >
                Notifications
            </button>
            <button
                className={activeTab === "security" ? styles.active : ""}
                onClick={() => setActiveTab("security")}
            >
                Security
            </button>
            <button
                className={activeTab === "privacy" ? styles.active : ""}
                onClick={() => setActiveTab("privacy")}
            >
                Privacy
            </button>
        </nav>
    );
};

export default SettingsNav;
