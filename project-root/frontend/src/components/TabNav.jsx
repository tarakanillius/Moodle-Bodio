import React from "react";
import styles from "../styles/tabNav.module.css";

export default function TabNav({ tabs, activeTab, setActiveTab, className }){
    return (
        <nav className={`${styles.tabNav} ${className || ''}`}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={activeTab === tab.id ? styles.active : ""}
                    onClick={() => setActiveTab(tab.id)}
                    disabled={tab.disabled}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
    );
};
