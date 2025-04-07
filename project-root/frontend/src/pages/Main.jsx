import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import styles from "../styles/main.module.css";
import Settings from "./Settings";
import Sidebar from "../components/Sidebar";
import Home from "./Home";
import Courses from "./Courses";
import UserData from "./UserData";
import CourseDetail from "./CourseDetails";

export default function Main() {
    const { selectedComponent, selectedCourseId } = useContext(GlobalContext);

    const renderComponent = () => {
        switch (selectedComponent) {
            case "home":
                return <Home />;
            case "teachers":
                return <h2>Docenti Component</h2>;
            case "students":
                return <h2>Studenti Component</h2>;
            case "modules":
                return <Courses />;
            case "settings":
                return <Settings />;
            case "userData":
                return <UserData />;
            case "course":
                return <CourseDetail courseId={selectedCourseId} />;
            default:
                return <Home />;
        }
    };

    return (
        <div className={styles.wrapper} style={{ backgroundColor: theme === "Dark" ? "#000000" : "#ffffff" }}>
            <Sidebar />
            <div className={styles.content} style={{ backgroundColor: theme === "Dark" ? "#000000" : "#ffffff" }}>
                {renderComponent()}
            </div>
        </div>
    );
}
