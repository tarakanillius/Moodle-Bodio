import React, { useState } from "react";
import styles from "../styles/settings.module.css";
import GeneralSettings from "../components/settings/GeneralSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import SecuritySettings from "../components/settings/SecuritySettings";
import PrivacySettings from "../components/settings/PrivacySettings";
import TabNav from "../components/TabNav";

export default function Settings() {
    const [activeTab, setActiveTab] = useState("general");

    const tabs = [
        { id: "general", label: "Generale" },
        { id: "notifications", label: "Notifiche" },
        { id: "security", label: "Sicurezza" },
        { id: "privacy", label: "Privacy" }
    ];

    return (
        <div className={styles.settingsWrapper}>
            <TabNav
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            <div className={styles.settingsContent}>
                {activeTab === "general" && <GeneralSettings />}
                {activeTab === "notifications" && <NotificationSettings />}
                {activeTab === "security" && <SecuritySettings />}
                {activeTab === "privacy" && <PrivacySettings />}
            </div>
        </div>
    );
};

