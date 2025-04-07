import React, {useContext, useState} from "react";
import styles from "../styles/settings.module.css";
import GeneralSettings from "../components/settings/GeneralSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import SecuritySettings from "../components/settings/SecuritySettings";
import PrivacySettings from "../components/settings/PrivacySettings";
import TabNav from "../components/TabNav";
import {GlobalContext} from "../context/GlobalContext";

export default function Settings() {
    const [activeTab, setActiveTab] = useState("Generale");
    const { theme } = useContext(GlobalContext);

    const tabs = [
        { id: "Generale", label: "Generale" },
        { id: "Notifiche", label: "Notifiche" },
        { id: "Sicurezza", label: "Sicurezza" },
        { id: "Privacy", label: "Privacy" }
    ];

    return (
        <div className={styles.settingsWrapper} style={{ backgroundColor: theme === "Dark" ? "#000000" : "#ffffff" }}>
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

