import React, { useState } from 'react';
import { FaTrash, FaDownload } from 'react-icons/fa';
import styles from "../../styles/courseDetail.module.css";

export default function SettingsTab({course, userRole}){
    const [courseData, setCourseData] = useState({
        name: course.name,
        description: course.description
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseData({ ...courseData, [name]: value });
    };

    const handleSave = () => {
        //TODO: Save course data logic
        alert("Course settings saved!");
    };

    const handleExport = () => {
        alert("Course export functionality would be implemented here");
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
            alert("Course deletion functionality would be implemented here");
        }
    };

    return (
        <div className={styles.settingsContainer}>
            <h2 className={styles.settingsTitle}>Course Settings</h2>

            <div className={styles.settingsForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="courseName">Course Name</label>
                    <input
                        type="text"
                        id="courseName"
                        name="name"
                        value={courseData.name}
                        onChange={handleChange}
                        disabled={userRole !== "teacher"}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="courseDescription">Description</label>
                    <textarea
                        id="courseDescription"
                        name="description"
                        value={courseData.description}
                        onChange={handleChange}
                        rows={4}
                        disabled={userRole !== "teacher"}
                    />
                </div>


            </div>

            <div className={styles.courseActions}>
                <button className={styles.button} onClick={handleExport}>
                    <FaDownload /> Export Course
                </button>
                {userRole === "teacher" && (
                    <button className={styles.button} onClick={handleSave}>
                        Salvare
                    </button>
                )}
                {userRole === "teacher" && (
                    <button className={styles.deleteButton} onClick={handleDelete}>
                        <FaTrash /> Delete Course
                    </button>
                )}
            </div>
        </div>
    );
};
