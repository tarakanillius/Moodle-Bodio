import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import "../styles/main.css";
import Settings from "./Settings";
import Sidebar from "../components/Sidebar";

export default function Main()  {
    const { selectedComponent } = useContext(GlobalContext);

    return (
        <div className="main-wrapper">
            {/* Sidebar on the left */}
            <Sidebar/>
            {/* Main content area */}
            <div className="content">
                {selectedComponent === "home" && <h2>Home Component</h2>}
                {selectedComponent === "teachers" && <h2>Docenti Component</h2>}
                {selectedComponent === "students" && <h2>Studenti Component</h2>}
                {selectedComponent === "modules" && <h2>Moduli Component</h2>}
                {selectedComponent === "settings" && <Settings/>}
            </div>
        </div>
    );
};
