import React, {useContext, useEffect, useRef, useState} from 'react';
import styles from "../styles/course.module.css";
import { FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';
import {GlobalContext} from "../context/GlobalContext";
import axios from 'axios';

export default function Course({viewMode = 'grid', name, description, sections, color, courseId }) {
    const { setSelectedComponent, setSelectedCourseId, refreshCourses, theme } = useContext(GlobalContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    const handleViewCourse = () => {
        setSelectedCourseId(courseId);
        setSelectedComponent("course");
    };

    const handleManageCourse = (e) => {
        e.stopPropagation();
        setMenuOpen(!menuOpen);
    };

    const handleEditCourse = (e) => {
        e.stopPropagation();
        setMenuOpen(false);
        setSelectedCourseId(courseId);
        setSelectedComponent("course");
        localStorage.setItem("openCourseTab", "settings");
    };

    const handleDeleteCourse = async (e) => {
        e.stopPropagation();
        setMenuOpen(false);
        if (window.confirm("Are you sure you want to delete this course?")) {
            try {
                await axios.delete(`http://127.0.0.1:5000/delete_course/${courseId}`);
                refreshCourses();
                alert("Course deleted successfully");
            } catch (error) {
                console.error("Error deleting course:", error);
                alert("Failed to delete course: " + (error.response?.data?.error || "Unknown error"));
            }
        }
    };

    if (viewMode === 'list') {
        return (
            <div className={styles.courseCardList} style={{backgroundColor: color}} onClick={handleViewCourse}>
                <div className={styles.courseInfoList}>
                    <h2 className={styles.courseNameList}>{name}</h2>
                    <p className={styles.courseDescriptionList}>{description}</p>
                </div>
                <div className={styles.sectionsListView}>
                    {sections && sections.length > 0 ? sections.map((section, index) => (
                        <span key={index} className={styles.sectionItem}>{section}</span>
                    )) : <span className={styles.sectionItem}>No sections</span>}
                </div>
                <div className={styles.courseActionsList}>
                    <div className={styles.menuContainer} ref={menuRef}>
                        <button className={styles.menuButton} onClick={handleManageCourse}>
                            <FaEllipsisV />
                        </button>
                        {menuOpen && (
                            <div className={styles.dropdownMenu}>
                                <button onClick={handleEditCourse}>
                                    <FaEdit/> Edit Course
                                </button>
                                <button onClick={handleDeleteCourse} className={styles.deleteButton}>
                                    <FaTrash/> Delete Course
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.courseCardGrid} style={{backgroundColor: color}}>
            <div className={styles.courseHeader}>
                <h2 className={styles.courseName} style={{ color: theme === "Dark" ? "#ffffff" : "#000000" }}>{name}</h2>
            </div>
            <p className={styles.courseDescription} style={{ color: theme === "Dark" ? "#ffffff" : "#000000" }}>{description}</p>
            <div className={styles.courseSections}>
                <h3 className={styles.sectionTitle} style={{ color: theme === "Dark" ? "#ffffff" : "#000000" }}>Sections:</h3>
                {sections ? (
                    <ul className={styles.sectionsList}>
                        {sections.map((section, index) => (
                            <li key={index} className={styles.sectionItem}>{section}</li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.noSections}>No sections available</p>
                )}
            </div>
            <div className={styles.courseFooter}>
                <button className={styles.viewButton} onClick={handleViewCourse}>Visualizza</button>
                <div className={styles.menuContainer} ref={menuRef}>
                    <button className={styles.manageButton} onClick={handleManageCourse}>
                        Gestisci
                    </button>
                    {menuOpen && (
                        <div className={styles.dropdownMenu}>
                            <button onClick={handleEditCourse}>
                                <FaEdit/> Edit Course
                            </button>
                            <button onClick={handleDeleteCourse} className={styles.deleteButton}>
                                <FaTrash/> Delete Course
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
