import React, {useContext} from "react";
import styles from "../styles/tabNav.module.css";
import {GlobalContext} from "../context/GlobalContext";

export default function TabNav({ tabs, activeTab, setActiveTab, className }){
    const {textColor} = useContext(GlobalContext);

    return (
        <nav className={`${styles.tabNav} ${className || ''}`}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={activeTab === tab.id ? styles.active : ""}
                    onClick={() => setActiveTab(tab.id)}
                    disabled={tab.disabled}
                    style={{ color: textColor}}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
    );
};
