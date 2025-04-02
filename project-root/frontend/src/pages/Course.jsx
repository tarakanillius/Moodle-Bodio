import React from 'react';
import { FaEllipsisV, FaUsers, FaChalkboardTeacher } from 'react-icons/fa';
import styles from "../styles/course.module.css";

export default function Course({viewMode = 'grid', name, description, teachers, students, sections, color }) {
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
                        <FaChalkboardTeacher className={styles.icon} />
                        {teachers.length} instructors
                    </span>
                    <span className={styles.studentCount}>
                        <FaUsers className={styles.icon} />
                        {students} students
                    </span>
                </div>
            </div>

            <p className={styles.courseDescription}>{description}</p>

            <div className={styles.courseSections}>
                <h3 className={styles.sectionTitle}>Sections:</h3>
                <ul className={styles.sectionsList}>
                    {sections.map((section, index) => (
                        <li key={index} className={styles.sectionItem}>{section}</li>
                    ))}
                </ul>
            </div>

            <div className={styles.courseFooter}>
                <button className={styles.viewButton}>View</button>
                <button className={styles.manageButton}>Manage</button>
            </div>
        </div>
    );
}
