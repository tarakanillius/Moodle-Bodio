import React, { useState, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import getAvatarImage from "../../utils/getAvatar";
import styles from "../../styles/courseDetail.module.css";
import modalStyles from "../../styles/modal.module.css";
import { GlobalContext } from "../../context/GlobalContext";
import { handleUnenrollStudent } from '../../handlers/courseHandlers';

export default function StudentsTab({ course, onCourseUpdated }) {
    const { backgroundColor2, textColor, BACKEND_URL, user } = useContext(GlobalContext);
    const [unenrollingStudent, setUnenrollingStudent] = useState(null);
    const [actionStatus, setActionStatus] = useState("");
    const [actionError, setActionError] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [unenrStudent, setUnenrStudent] = useState(false);
    const [show, setShow] = useState(false);

    const isTeacher = user && user.role === 'teacher';

    const handleClose = async () => {
        setShow(false);
        setSelectedStudent(null);
        setUnenrStudent(false);
    };

    const handleSave = async () => {
        if (unenrStudent) {
            await handleUnenroll(selectedStudent.id);
        }
        setShow(false);
        setUnenrStudent(false);
    };

    const handleShow = async (student) => {
        setSelectedStudent(student);
        setShow(true);
    };

    const handleUnenroll = async (studentId) => {
        if (!isTeacher) return;

        if (!course.students || course.students.length === 0) {
            setActionError("No students enrolled in this course");
            return;
        }

        setUnenrollingStudent(studentId);
        setActionStatus("Unenrolling student...");
        setActionError("");

        try {
            const result = await handleUnenrollStudent(BACKEND_URL, studentId, course.id);

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
        <div className={styles.studentsContainer} style={{ backgroundColor: backgroundColor2 }}>
            <h2 className={styles.studentsTitle} style={{ color: textColor }}>Enrolled Students</h2>
            {course.students && course.students.length > 0 ? (
                <ul className={styles.studentsList}>
                    {course.students.map((student) => (
                        <li
                            key={student.id}
                            className={styles.studentItem}
                            onClick={() => handleShow(student)}
                            style={{ color: textColor }}
                        >
                            <img
                                src={getAvatarImage("student", student.sex)}
                                alt={student.name}
                                className={styles.studentAvatar}
                            />
                            <div className={styles.studentInfo}>
                                <span className={styles.studentName}>{student.name}</span>
                                <span className={styles.studentEmail}>{student.email}</span>
                            </div>
                            {isTeacher && (
                                <button
                                    className={styles.unenrollButton}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleUnenroll(student.id);
                                    }}
                                    disabled={unenrollingStudent === student.id}
                                >
                                    {unenrollingStudent === student.id ? "Unenrolling..." : "Unenroll"}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className={styles.noStudents}>No students enrolled in this course</p>
            )}

            <Modal show={show} onHide={handleClose} className={styles.modalContent}>
                <Modal.Header className={styles.modalHeader}>
                    <Modal.Title><h2><strong>Student Card</strong></h2></Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.modalBody}>
                    <img
                        src={getAvatarImage("student", selectedStudent?.sex)}
                        alt={selectedStudent?.name}
                        className={styles.studentAvatar}
                    />
                    <p><strong>Nome:</strong> {selectedStudent?.name.split(' ')[0]}</p>
                    <p><strong>Cognome:</strong> {selectedStudent?.name.split(' ')[1]}</p>
                    <p><strong>Email:</strong> {selectedStudent?.email}</p>
                    {isTeacher && (
                        <Button
                            onClick={() => setUnenrStudent(true)}
                            variant="danger"
                        >
                            Unenroll Student
                        </Button>
                    )}
                </Modal.Body>
                <Modal.Footer className={styles.modalFooter}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </Modal.Footer>
            </Modal>

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
        </div>
    );
}
