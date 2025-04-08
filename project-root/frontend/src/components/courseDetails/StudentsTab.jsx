import React, {useState, useContext} from 'react';
import getAvatarImage from "../../utils/getAvatar";
import styles from "../../styles/courseDetail.module.css";
import modalStyles from "../../styles/modal.module.css";
import {GlobalContext} from "../../context/GlobalContext";

export default function StudentsTab({ course, onCourseUpdated }){
    const {theme, handleUnenrollStudent, user} = useContext(GlobalContext);
    const [unenrollingStudent, setUnenrollingStudent] = useState(null);
    const [actionStatus, setActionStatus] = useState("");
    const [actionError, setActionError] = useState("");

    const isTeacher = user && user.role === 'teacher';

    const handleUnenroll = async (studentId) => {
        if (!isTeacher) return;

        setUnenrollingStudent(studentId);
        setActionStatus("Unenrolling student...");
        setActionError("");

        try {
            const result = await handleUnenrollStudent(studentId, course.id);
            console.log("Unenroll result:", result);

            if (result.success) {
                setActionStatus("Student unenrolled successfully!");

                if (onCourseUpdated) {
                    const updatedCourse = {
                        ...course,
                        students: course.students.filter(student => student.id !== studentId)
                    };
                    onCourseUpdated(updatedCourse);
                }

                setTimeout(() => {
                    setActionStatus("");
                }, 3000);
            } else {
                setActionError(result.error || "Failed to unenroll student");
            }
        } catch (error) {
            console.error("Error in unenroll handler:", error);
            setActionError("An unexpected error occurred");
        } finally {
            setUnenrollingStudent(null);
        }
    };

    return (
        <div className={styles.studentsContainer}>
            <h2 className={styles.studentsTitle} style={{ color: theme === "Dark" ? "#ffffff" : "#000000" }}>Enrolled Students</h2>

            {actionStatus && (
                <div className={modalStyles.successMessage}>
                    {actionStatus}
                </div>
            )}

            {actionError && (
                <div className={modalStyles.errorMessage}>
                    {actionError}
                </div>
            )}

            {course.students && course.students.length > 0 ? (
                <ul className={styles.studentsList}>
                    {course.students.map(student => (
                        <li key={student.id} className={`${styles.studentItem} ${theme === "Dark" ? styles.darkTheme : styles.lightTheme}`}>
                            <img
                                src={getAvatarImage("student", student.gender || "male")}
                                alt={student.name}
                                className={styles.studentAvatar}
                            />
                            <div className={styles.studentInfo}>
                                <span className={styles.studentName} style={{ color: theme === "Dark" ? "#ffffff" : "#000000" }}>{student.name}</span>
                                <span className={styles.studentEmail}>{student.email}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className={styles.noStudents}>No students enrolled in this course</p>
            )}
        </div>
    );
};
