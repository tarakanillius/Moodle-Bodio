import React, {useContext, useEffect, useRef, useState} from 'react';
import styles from "../styles/course.module.css";
import { FaEllipsisV, FaUsers, FaChalkboardTeacher, FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import {GlobalContext} from "../context/GlobalContext";

export default function Course({viewMode = 'grid', name, description, teachers, students, sections, color, courseId }) {
    const { setSelectedComponent, setSelectedCourseId } = useContext(GlobalContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
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
        alert("Edit course functionality would be implemented here");
    };

    const handleDeleteCourse = (e) => {
        e.stopPropagation();
        setMenuOpen(false);
        if (window.confirm("Are you sure you want to delete this course?")) {
            alert("Delete course functionality would be implemented here");
        }
    };

    const handleEnrollStudents = (e) => {
        e.stopPropagation();
        setMenuOpen(false);
        alert("Enroll students functionality would be implemented here");
    };

    if (viewMode === 'list') {
        return (
            <div className={styles.courseCardList} style={{backgroundColor: color}}>
                <div className={styles.courseInfoList}>
                    <h2 className={styles.courseNameList}>{name}</h2>
                    <p className={styles.courseDescriptionList}>{description}</p>
                </div>
                <div className={styles.sectionsListView}>
                    {sections.map((section, index) => (
                        <span key={index} className={styles.sectionItemList}>{section}</span>
                    ))}
                </div>
                <div className={styles.courseActionsList}>
                    <button className={styles.menuButton}>
                        <FaEllipsisV />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.courseCardGrid} style={{backgroundColor: color}}>
            <div className={styles.courseHeader}>
                <h2 className={styles.courseName}>{name}</h2>
                <div className={styles.courseStats}>
                    <span className={styles.teacherCount}>
                        <FaChalkboardTeacher className={styles.icon}/>
                        {teachers && teachers.length > 0
                            ? `${teachers.length} instructor${teachers.length > 1 ? 's' : ''}`
                            : 'No instructor'}
                    </span>
                    <span className={styles.studentCount}>
                        <FaUsers className={styles.icon}/>
                        {students} student{students !== 1 ? 's' : ''}
                    </span>
                </div>
            </div>

            <p className={styles.courseDescription}>{description}</p>

            <div className={styles.courseSections}>
                <h3 className={styles.sectionTitle}>Sections:</h3>
                {sections && sections.length > 0 ? (
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
                        <div className={styles.dropdownMenu} style={{ zIndex: 1000 }}>
                            <button onClick={handleEditCourse}>
                                <FaEdit/> Edit Course
                            </button>
                            <button onClick={handleEnrollStudents}>
                                <FaUserPlus/> Enroll Students
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
