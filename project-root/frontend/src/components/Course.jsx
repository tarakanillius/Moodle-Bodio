import React, { useContext, useState, useRef, useEffect } from 'react';
import { GlobalContext } from "../context/GlobalContext";
import { FaEllipsisV, FaUsers, FaChalkboardTeacher, FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import styles from "../styles/course.module.css";

export default function Course({viewMode = 'grid', name, description, teachers, students, sections, courseId }) {
    const { setSelectedComponent, setSelectedCourseId } = useContext(GlobalContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Handle clicking outside to close the menu
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
        // Set the courseId in context
        setSelectedCourseId(courseId);
        // Change the selected component to "course"
        setSelectedComponent("course");
    };

    const handleManageCourse = (e) => {
        e.stopPropagation(); // Prevent triggering the card click
        setMenuOpen(!menuOpen);
    };

    const handleEditCourse = (e) => {
        e.stopPropagation(); // Prevent triggering the card click
        setMenuOpen(false);
        // You could set a different component or mode here
        alert("Edit course functionality would be implemented here");
    };

    const handleDeleteCourse = (e) => {
        e.stopPropagation(); // Prevent triggering the card click
        setMenuOpen(false);
        if (window.confirm("Are you sure you want to delete this course?")) {
            alert("Delete course functionality would be implemented here");
        }
    };

    const handleEnrollStudents = (e) => {
        e.stopPropagation(); // Prevent triggering the card click
        setMenuOpen(false);
        alert("Enroll students functionality would be implemented here");
    };

    if (viewMode === 'list') {
        return (
            <div className={styles.courseCardList} onClick={handleViewCourse}>
                <div className={styles.courseInfoList}>
                    <h2 className={styles.courseNameList}>{name}</h2>
                    <p className={styles.courseDescriptionList}>{description}</p>
                </div>
                <div className={styles.sectionsListView}>
                    {sections && sections.length > 0 ? (
                        sections.map((section, index) => (
                            <span key={index} className={styles.sectionItemList}>{section}</span>
                        ))
                    ) : (
                        <span className={styles.noSections}>No sections</span>
                    )}
                </div>
                <div className={styles.courseActionsList} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.menuContainer} ref={menuRef}>
                        <button className={styles.menuButton} onClick={handleManageCourse}>
                            <FaEllipsisV />
                        </button>
                        {menuOpen && (
                            <div className={styles.dropdownMenu}>
                                <button onClick={handleEditCourse}>
                                    <FaEdit /> Edit Course
                                </button>
                                <button onClick={handleEnrollStudents}>
                                    <FaUserPlus /> Enroll Students
                                </button>
                                <button onClick={handleDeleteCourse} className={styles.deleteButton}>
                                    <FaTrash /> Delete Course
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.courseCardGrid}>
            <div className={styles.courseHeader}>
                <h2 className={styles.courseName}>{name}</h2>
                <div className={styles.courseStats}>
                    <span className={styles.teacherCount}>
                        <FaChalkboardTeacher className={styles.icon} />
                        {teachers && teachers.length > 0
                            ? `${teachers.length} instructor${teachers.length > 1 ? 's' : ''}`
                            : 'No instructor'}
                    </span>
                    <span className={styles.studentCount}>
                        <FaUsers className={styles.icon} />
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
                        Gestisci <FaEllipsisV className={styles.menuIcon} />
                    </button>
                    {menuOpen && (
                        <div className={styles.dropdownMenu}>
                            <button onClick={handleEditCourse}>
                                <FaEdit /> Edit Course
                            </button>
                            <button onClick={handleEnrollStudents}>
                                <FaUserPlus /> Enroll Students
                            </button>
                            <button onClick={handleDeleteCourse} className={styles.deleteButton}>
                                <FaTrash /> Delete Course
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
