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
        { id: "Generale", label: "Generale" },
        { id: "Notifiche", label: "Notifiche" },
        { id: "Sicurezza", label: "Sicurezza" },
        { id: "Privacy", label: "Privacy" }
    ];

    return (
        <div className={styles.settingsWrapper}>
            <TabNav
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            <div className={styles.settingsContent}>
                {activeTab === "Generale" && <GeneralSettings />}
                {activeTab === "Notifiche" && <NotificationSettings />}
                {activeTab === "Sicurezza" && <SecuritySettings />}
                {activeTab === "Privacy" && <PrivacySettings />}
            </div>
        </div>
    );
};

