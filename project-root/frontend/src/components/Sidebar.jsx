// Sidebar.jsx
import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import "../styles/main.css";

const Sidebar = () => {
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
        <div className="sidebar">
            <h1>m0.0dle</h1>
            <div className="sidebar-buttons">
                <button
                    className={selectedComponent === "home" ? "active" : ""}
                    onClick={() => setSelectedComponent("home")}
                >
                    Home
                </button>
                <button
                    className={selectedComponent === "teachers" ? "active" : ""}
                    onClick={() => setSelectedComponent("teachers")}
                >
                    Docenti
                </button>
                <button
                    className={selectedComponent === "students" ? "active" : ""}
                    onClick={() => setSelectedComponent("students")}
                >
                    Studenti
                </button>
                <button
                    className={selectedComponent === "modules" ? "active" : ""}
                    onClick={() => setSelectedComponent("modules")}
                >
                    Moduli
                </button>
                <button
                    className={selectedComponent === "settings" ? "active" : ""}
                    onClick={() => setSelectedComponent("settings")}
                >
                    Impostazioni
                </button>
            </div>
            <div className="sidebar-account">
                <div className="account" onClick={() => setSelectedComponent("userData")}>
                    <img
                        src={getAvatarImage(user.role, user.gender)}
                        alt="User"
                        className="avatar"

                    />
                    <div className="account-info">
                        <span className="name">{user.name}</span>
                        <span className="role">{user.role}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
