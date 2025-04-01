import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import "../styles/main.css";

const Main = () => {
    const { selectedComponent, setSelectedComponent } = useContext(GlobalContext);

    const user = {
        name: "Mario Rossi",
        role: "Student",
        avatar: "/favicon.ico",
    };

    return (
        <div className="main-wrapper">
            {/* Sidebar on the left */}
            <div className="sidebar">
                <h1>m0.0dle</h1>
                <div className="sidebar-buttons">
                    <button className={selectedComponent === "home" ? "active" : ""} onClick={() => setSelectedComponent("home")}>
                        Home
                    </button>
                    <button className={selectedComponent === "teachers" ? "active" : ""} onClick={() => setSelectedComponent("teachers")}>
                        Docenti
                    </button>
                    <button className={selectedComponent === "students" ? "active" : ""} onClick={() => setSelectedComponent("students")}>
                        Studenti
                    </button>
                    <button className={selectedComponent === "modules" ? "active" : ""} onClick={() => setSelectedComponent("modules")}>
                        Moduli
                    </button>
                    <button className={selectedComponent === "settings" ? "active" : ""} onClick={() => setSelectedComponent("settings")}>
                        Impostazioni
                    </button>
                </div>
                <div className="sidebar-account">
                    <div className="account">
                        <img src={user.avatar} alt="User" className="avatar" />
                        <div className="account-info">
                            <span className="name">{user.name}</span>
                            <span className="role">{user.role}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content area */}
            <div className="content">
                {selectedComponent === "home" && <h2>Home Component</h2>}
                {selectedComponent === "teachers" && <h2>Docenti Component</h2>}
                {selectedComponent === "students" && <h2>Studenti Component</h2>}
                {selectedComponent === "modules" && <h2>Moduli Component</h2>}
                {selectedComponent === "settings" && <h2>Impostazioni Component</h2>}
            </div>
        </div>
    );
};

export default Main;
