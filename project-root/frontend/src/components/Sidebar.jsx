import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import styles from "../styles/main.module.css";
import getAvatarImage from "../utils/getAvatar";

export default function Sidebar() {
    const { selectedComponent, setSelectedComponent, user } = useContext(GlobalContext);

    return (
        <div className={styles.sidebar}>
            <h1>m0.0dle</h1>
            <div className={styles.sidebarButtons}>
                <button
                    className={selectedComponent === "home" ? styles.active : ""}
                    onClick={() => setSelectedComponent("home")}
                >
                    Home
                </button>
                <button
                    className={selectedComponent === "modules" ? styles.active : ""}
                    onClick={() => setSelectedComponent("modules")}
                >
                    Moduli
                </button>
                <button
                    className={selectedComponent === "settings" ? styles.active : ""}
                    onClick={() => setSelectedComponent("settings")}
                >
                    Impostazioni
                </button>
            </div>
            <div className={styles.sidebarAccount}>
                <div className={styles.account} onClick={() => setSelectedComponent("userData")}>
                    <img
                        src={getAvatarImage(user.role, user.gender)}
                        alt="User"
                        className={styles.avatar}
                    />
                    <div className={styles.accountInfo}>
                        <span className={styles.name}>{user.name} {user.surname}</span>
                        <span className={styles.role}>{user.role}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
