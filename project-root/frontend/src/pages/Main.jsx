import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import styles from "../styles/main.module.css";
import Settings from "./Settings";
import Sidebar from "../components/Sidebar";
import Home from "./Home";
import Courses from "./Courses";

export default function Main() {
    const { selectedComponent } = useContext(GlobalContext);

    return (
        <div className={styles.wrapper}>
            <Sidebar/>
            <div className={styles.content}>
                {selectedComponent === "home" && <Home />}
                {selectedComponent === "teachers" && <h2>Docenti Component</h2>}
                {selectedComponent === "students" && <h2>Studenti Component</h2>}
                {selectedComponent === "modules" && <Courses/>}
                {selectedComponent === "settings" && <Settings/>}
            </div>
        </div>
    );
};
