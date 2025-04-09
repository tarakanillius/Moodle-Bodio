import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import styles from "../styles/main.module.css";
import getAvatarImage from "../utils/getAvatar";

export default function Sidebar() {
    const { selectedComponent, setSelectedComponent, user, theme, textColor } = useContext(GlobalContext);

    return (
        <div className={styles.sidebar} style={{backgroundColor: theme === "Dark" ? "#000000" : "#ffffff"}}>
            <img
                className={styles.image}
                src="/assets/logo_ameti.jpeg"
                alt="AMETI Logo"
            />
            <div className={styles.sidebarButtons}>
                <button
                    className={selectedComponent === "home" ? styles.active : ""}
                    onClick={() => setSelectedComponent("home")}
                    style={{backgroundColor: theme === "Dark" ? "#000000" : "#ffffff", color: textColor}}
                >
                    Home
                </button>
                <button
                    className={selectedComponent === "modules" ? styles.active : ""}
                    onClick={() => setSelectedComponent("modules")}
                    style={{backgroundColor: theme === "Dark" ? "#000000" : "#ffffff", color: textColor}}
                >
                    Moduli
                </button>
                <button
                    className={selectedComponent === "settings" ? styles.active : ""}
                    onClick={() => setSelectedComponent("settings")}
                    style={{backgroundColor: theme === "Dark" ? "#000000" : "#ffffff", color: textColor}}
                >
                    Impostazioni
                </button>
            </div>
            <div className={styles.sidebarAccount}>
                <div
                    className={styles.account}
                    onClick={() => setSelectedComponent("userData")}
                    style={{backgroundColor: theme === "Dark" ? "#000000" : "#ffffff", color: textColor}}>
                    <img
                        src={getAvatarImage(user.role, user.gender)}
                        alt="User"
                        className={styles.avatar}
                    />
                    <div className={styles.accountInfo}>
                        <span className={styles.name} style={{color: textColor}}>{user.name} {user.surname}</span>
                        <span className={styles.role} style={{color: textColor}}>{user.role}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
