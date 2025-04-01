import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import "../styles/main.css";
import Settings from "./Settings";
import Sidebar from "../components/Sidebar";
import {useNavigate} from "react-router-dom";
import UserData from "./UserData";

export default function Main()  {
    const { selectedComponent } = useContext(GlobalContext);

    return (
        <div className="main-wrapper">
            {/* Sidebar on the left */}
            <Sidebar/>
            {/* Main content area */}
            <div className={`content ${selectedComponent === "userData" ? "userData-style" : ""}`}>
                {selectedComponent === "home" && <h2>Home Component</h2>}
                {selectedComponent === "teachers" && <h2>Docenti Component</h2>}
                {selectedComponent === "students" && <h2>Studenti Component</h2>}
                {selectedComponent === "modules" && <h2>Moduli Component</h2>}
                {selectedComponent === "settings" && <Settings/>}
                {selectedComponent === "userData" && <UserData/>}
            </div>
        </div>
    );
};
