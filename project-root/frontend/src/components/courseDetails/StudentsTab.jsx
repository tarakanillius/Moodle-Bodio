import React, { useState, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import getAvatarImage from "../../utils/getAvatar";
import styles from "../../styles/courseDetail.module.css";
import modalStyles from "../../styles/modal.module.css";
import {GlobalContext} from "../../context/GlobalContext";
import { FaUserMinus } from 'react-icons/fa';

export default function StudentsTab({ course, onCourseUpdated }) {
    const {theme, handleUnenrollStudent, user} = useContext(GlobalContext);
    const [unenrollingStudent, setUnenrollingStudent] = useState(null);
    const [actionStatus, setActionStatus] = useState("");
    const [actionError, setActionError] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [show, setShow] = useState(false);

    const isTeacher = user && user.role === 'teacher';

    const handleClose = async () => {
        setShow(false);
        setSelectedStudent(null);
    };

    const handleShow = async (student) => {
        setSelectedStudent(student);
        setShow(true);
    };

    const handleUnenroll = async (studentId) => {
        if (!isTeacher) return;

    if (!course.students || course.students.length === 0) {
        return <p>No students enrolled in this course</p>;
    }
        setUnenrollingStudent(studentId);
        setActionStatus("Unenrolling student...");
        setActionError("");

        try {
            const result = await handleUnenrollStudent(studentId, course.id);

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
            <h2 className={styles.studentsTitle}>Enrolled Students</h2>
            <ul className={styles.studentsList}>
                {course.students.map((student) => (
                    <li
                        key={student.id}
                        className={styles.studentItem}
                        onClick={() => handleShow(student)}
                    >
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

            <Modal show={show} onHide={handleClose} className={styles.modalContent}>
                <Modal.Header className={styles.modalHeader}>
                    <Modal.Title>{selectedStudent?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.modalBody}>
                    <img
                        src={getAvatarImage("student", selectedStudent?.gender || "male")}
                        alt={selectedStudent?.name}
                        className={styles.studentAvatar}
                    />
                    <p><strong>Email:</strong> {selectedStudent?.email}</p>
                    <p><strong>Gender:</strong> {selectedStudent?.gender}</p>
                </Modal.Body>
                <Modal.Footer className={styles.modalFooter}>
                    <Button onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>

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
                            {isTeacher && (
                                <button
                                    className={styles.unenrollButton}
                                    onClick={() => handleUnenroll(student.id)}
                                    disabled={unenrollingStudent === student.id}
                                    title="Unenroll student"
                                >
                                    <FaUserMinus />
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className={styles.noStudents}>No students enrolled in this course</p>
            )}
        </div>
    );
};

