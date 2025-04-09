import React, {useContext, useState} from 'react';
import styles from "../styles/course.module.css";
import { FaEllipsisV, FaUsers, FaChalkboardTeacher, FaEdit, FaTrash } from 'react-icons/fa';
import {GlobalContext} from "../context/GlobalContext";
import axios from 'axios';
import Dropdown from './Dropdown';

function hexToRgba(hex, opacity = 0.4) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export default function Course({viewMode = 'grid', name, description, teachers, students, sections, color, courseId }) {
    const { setSelectedComponent, setSelectedCourseId, refreshCourses, fetchCourses, backgroundColor2, textColor, BACKEND_URL } = useContext(GlobalContext);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleViewCourse = () => {
        setSelectedCourseId(courseId);
        setSelectedComponent("course");
    };

    const handleEditCourse = (e) => {
        e.stopPropagation();
        setSelectedCourseId(courseId);
        setSelectedComponent("course");
        localStorage.setItem("openCourseTab", "settings");
    };

    const handleDeleteCourse = async (e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this course?")) {
            try {
                await axios.delete(`${BACKEND_URL}/delete_course/${courseId}`);
                refreshCourses();
                alert("Course deleted successfully");
            } catch (error) {
                console.error("Error deleting course:", error);
                alert("Failed to delete course: " + (error.response?.data?.error || "Unknown error"));
            }
        }
        fetchCourses();
    };

    const courseManagementItems = [
        {
            icon: <FaEdit />,
            label: "Edit Course",
            onClick: handleEditCourse
        },
        {
            icon: <FaTrash />,
            label: "Delete Course",
            onClick: handleDeleteCourse,
            className: styles.deleteButton
        }
    ];

    if (viewMode === 'list') {
        return (
            <div className={styles.courseCardList} style={{backgroundColor: hexToRgba(color)}} onClick={handleViewCourse}>
                <div className={styles.courseInfoList}>
                    <h2 className={styles.courseNameList} style={{color: textColor}}>{name}</h2>
                    <div className={styles.courseStats}>
                        <div className={styles.teacherCount} style={{color: textColor}}>
                            <FaChalkboardTeacher className={styles.icon}/>
                            {teachers && teachers.length > 0
                                ? `${teachers.length} instructor${teachers.length > 1 ? 's' : ''}`
                                : 'No instructor'}
                        </div>
                        <div className={styles.studentCount} style={{color: textColor}}>
                            <FaUsers className={styles.icon}/>
                            {students} student{students !== 1 ? 's' : ''}
                        </div>
                    </div>
                    <p className={styles.courseDescriptionList} style={{color: textColor}}>{description}</p>
                </div>
                <div className={styles.sectionsListView}>
                    {sections && sections.length > 0 ? sections.map((section, index) => (
                        <span key={index} className={styles.sectionItem}>{section}</span>
                    )) : <span className={styles.sectionItem}>No sections</span>}
                </div>
                <div
                    className={styles.courseActionsList}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Dropdown
                        trigger={
                            <button className={styles.menuButton} style={{color: textColor}}>
                                <FaEllipsisV/>
                            </button>
                        }
                        isOpen={menuOpen}
                        setIsOpen={setMenuOpen}
                        items={courseManagementItems}
                        borderColor={backgroundColor2}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.courseCardGrid} style={{backgroundColor: hexToRgba(color)}}>
            <div className={styles.courseHeader}>
                <h2 className={styles.courseName} style={{color: textColor}}>{name}</h2>
            </div>
            <div className={styles.courseStats}>
                <span className={styles.teacherCount} style={{color: textColor}}>
                    <FaChalkboardTeacher className={styles.icon}/>
                    {teachers && teachers.length > 0
                        ? `${teachers.length} instructor${teachers.length > 1 ? 's' : ''}`
                        : 'No instructor'}
                </span>
                <span className={styles.studentCount} style={{color: textColor}}>
                    <FaUsers className={styles.icon}/>
                    {students} student{students !== 1 ? 's' : ''}
                </span>
            </div>
            <p className={styles.courseDescription}
               style={{color: textColor}}>{description}</p>
            <div className={styles.courseSections}>
                <h3 className={styles.sectionTitle}
                    style={{color: textColor}}>Sections:</h3>
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
                <button
                    className={styles.viewButton}
                    onClick={handleViewCourse}
                    style={{backgroundColor: backgroundColor2, color: textColor}}
                >
                    Visualizza
                </button>
                <Dropdown
                    trigger={
                        <button className={styles.manageButton}>
                            Gestisci
                        </button>
                    }
                    isOpen={menuOpen}
                    setIsOpen={setMenuOpen}
                    items={courseManagementItems}
                    borderColor={backgroundColor2}
                />
            </div>
        </div>
    );
}
