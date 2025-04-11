import React, {useContext} from "react";
import { GlobalContext } from "../context/GlobalContext";
import styles from "../styles/main.module.css";
import getAvatarImage from "../utils/getAvatar";

export default function Sidebar() {
    const { selectedComponent, setSelectedComponent, user, loading, backgroundColor, textColor } = useContext(GlobalContext);

    const getAvatarSrc = () => {
        if (!user) return "/assets/default-avatar.png";
        return getAvatarImage(user.role, user.sex);
    };

    return (
        <div className={styles.sidebar} style={{backgroundColor}}>
            <img
                className={styles.image}
                src="/assets/logo_ameti.jpeg"
                alt="AMETI Logo"
            />
            <div className={styles.sidebarButtons}>
                <button
                    className={selectedComponent === "home" ? styles.active : ""}
                    onClick={() => setSelectedComponent("home")}
                    style={{backgroundColor, color: textColor}}
                >
                    Home
                </button>
                <button
                    className={selectedComponent === "modules" ? styles.active : ""}
                    onClick={() => setSelectedComponent("modules")}
                    style={{backgroundColor, color: textColor}}
                >
                    Moduli
                </button>
                <button
                    className={selectedComponent === "settings" ? styles.active : ""}
                    onClick={() => setSelectedComponent("settings")}
                    style={{backgroundColor, color: textColor}}
                >
                    Impostazioni
                </button>
            </div>
            <div className={styles.sidebarAccount}>
                <div
                    className={styles.account}
                    onClick={() => setSelectedComponent("userData")}
                    style={{backgroundColor, color: textColor}}>
                    <img
                        src={getAvatarSrc()}
                        alt="User"
                        className={styles.avatar}
                    />
                    <div className={styles.accountInfo}>
                        <span className={styles.name} style={{color: textColor}}>
                            {loading ? 'Loading...' : user ? `${user.name} ${user.surname}` : 'Guest'}
                        </span>
                        <span className={styles.role} style={{color: textColor}}>
                            {loading ? '' : user?.role || ''}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
