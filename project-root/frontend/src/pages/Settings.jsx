import React, { useState, useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import TabNav from '../components/TabNav';
import GeneralSettings from '../components/settings/GeneralSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import PrivacySettings from '../components/settings/PrivacySettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import styles from '../styles/settings.module.css';

export default function Settings() {
    const { backgroundColor2, textColor } = useContext(GlobalContext);
    const [activeTab, setActiveTab] = useState("general");

    const settingsTabs = [
        { id: "general", label: "General" },
        { id: "notifications", label: "Notifications" },
        { id: "privacy", label: "Privacy" },
        { id: "security", label: "Security" }
    ];

    return (
        <div className={styles.settingsContainer} style={{ backgroundColor: backgroundColor2 }}>
            <h1 className={styles.settingsTitle} style={{ color: textColor }}>Settings</h1>
            <TabNav
                tabs={settingsTabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            <div className={styles.settingsContent}>
                {activeTab === "general" && <GeneralSettings />}
                {activeTab === "notifications" && <NotificationSettings />}
                {activeTab === "privacy" && <PrivacySettings />}
                {activeTab === "security" && <SecuritySettings />}
            </div>
        </div>
    );
}
