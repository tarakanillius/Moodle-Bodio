import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import styles from "../styles/main.module.css";

export default function Sidebar() {
    const { selectedComponent, setSelectedComponent } = useContext(GlobalContext);

    const user = {
        name: "Mario Rossi",
        role: "student",
        gender: "male",
    };

    const getAvatarImage = (role, gender) => {
        if (role === "teacher" && gender === "female") {
            return "/assets/teacher-female.png";
        } else if (role === "teacher" && gender === "male") {
            return "/assets/teacher-male.png";
        } else if (role === "student" && gender === "female") {
            return "/assets/student-female.png";
        } else if (role === "student" && gender === "male") {
            return "/assets/student-male.png";
        }
        return null;
    };

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
                    className={selectedComponent === "teachers" ? styles.active : ""}
                    onClick={() => setSelectedComponent("teachers")}
                >
                    Docenti
                </button>
                <button
                    className={selectedComponent === "students" ? styles.active : ""}
                    onClick={() => setSelectedComponent("students")}
                >
                    Studenti
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
                        <span className={styles.name}>{user.name}</span>
                        <span className={styles.role}>{user.role}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
