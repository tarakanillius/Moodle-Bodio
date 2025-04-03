import React from 'react';
import getAvatarImage from "../../utils/getAvatar";
import styles from "../../styles/courseDetail.module.css";

export default function StudentsTab({ course }){
    return (
        <div className={styles.studentsContainer}>
            <h2 className={styles.studentsTitle}>Enrolled Students</h2>
            {course.students && course.students.length > 0 ? (
                <ul className={styles.studentsList}>
                    {course.students.map(student => (
                        <li key={student.id} className={styles.studentItem}>
                            <img
                                src={getAvatarImage("student", student.gender || "male")}
                                alt={student.name}
                                className={styles.studentAvatar}
                            />
                            <div className={styles.studentInfo}>
                                <span className={styles.studentName}>{student.name}</span>
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
