import React, { useState } from "react";
import styles from "../styles/settings.module.css";
import SettingsNav from "../components/settings/SettingsNav";
import GeneralSettings from "../components/settings/GeneralSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import SecuritySettings from "../components/settings/SecuritySettings";
import PrivacySettings from "../components/settings/PrivacySettings";

export default function Settings() {
    const [activeTab, setActiveTab] = useState("general");

    return (
        <div className={styles.settingsWrapper}>
            {/* Navigation Tabs */}
            <SettingsNav activeTab={activeTab} setActiveTab={setActiveTab} />
            {/* Settings Content */}
            <div className={styles.settingsContent}>
                {activeTab === "general" && <GeneralSettings />}
                {activeTab === "notifications" && <NotificationSettings />}
                {activeTab === "security" && <SecuritySettings />}
                {activeTab === "privacy" && <PrivacySettings />}
            </div>
        </div>
    );
};

