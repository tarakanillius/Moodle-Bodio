import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import getAvatarImage from "../../utils/getAvatar";
import styles from "../../styles/courseDetail.module.css";

const StudentsTab = ({ course }) => {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        setSelectedStudent(null);
    };

    const handleShow = (student) => {
        setSelectedStudent(student);
        setShow(true);
    };

    if (!course.students || course.students.length === 0) {
        return <p>No students enrolled in this course</p>;
    }

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

            <Modal show={show} onHide={handleClose} className="modalContent">
                <Modal.Header closeButton className="modalHeader">
                    <Modal.Title>{selectedStudent?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modalBody">
                    <img
                        src={getAvatarImage("student", selectedStudent?.gender || "male")}
                        alt={selectedStudent?.name}
                        className={styles.studentAvatar}
                    />
                    <p><strong>Email:</strong> {selectedStudent?.email}</p>
                    <p><strong>Gender:</strong> {selectedStudent?.gender}</p>
                </Modal.Body>
                <Modal.Footer className="modalFooter">
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={handleClose}>Save Changes</Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default StudentsTab;
