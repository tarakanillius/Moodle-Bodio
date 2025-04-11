import React, { useState, useContext } from 'react';
import Modal from "../Modal";
import styles from "../../styles/modal.module.css";
import { GlobalContext } from "../../context/GlobalContext";
import { addCourse } from '../../handlers/courseHandlers';

export default function AddCourseModal({ isOpen, onClose, onCourseAdded }) {
    const { user, BACKEND_URL, backgroundColor2, textColor } = useContext(GlobalContext);

    const [newCourse, setNewCourse] = useState({
        name: '',
        description: '',
        color: 'rgba(0, 170, 255, 0.5)'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCourse(prev => ({ ...prev, [name]: value }));
    };

    const handleColorChange = (e) => {
        setNewCourse(prev => ({ ...prev, color: e.target.value }));
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');

        const courseData = {
            name: newCourse.name,
            description: newCourse.description,
            teacherId: user.id,
            color: newCourse.color
        };

        try {
            const result = await addCourse(BACKEND_URL, courseData);

            if (result.success) {
                setNewCourse({
                    name: '',
                    description: '',
                    color: 'rgba(0, 170, 255, 0.5)'
                });

                onCourseAdded();
                onClose();
            } else {
                setSubmitError(result.error || "Failed to add course");
            }
        } catch (error) {
            setSubmitError(error.message || "An error occurred while adding the course");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setNewCourse({
            name: '',
            description: '',
            color: 'rgba(0, 170, 255, 0.5)'
        });
        setSubmitError('');
        onClose();
    };

    const inputStyle = {
        backgroundColor: backgroundColor2,
        color: textColor,
        borderColor: textColor === '#ffffff' ? '#444' : '#e2e8f0'
    };

    const labelStyle = {
        color: textColor
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add New Course"
        >
            <form onSubmit={handleAddCourse} className={styles.modalForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="courseName" style={labelStyle}>Course Name</label>
                    <input
                        type="text"
                        id="courseName"
                        name="name"
                        value={newCourse.name}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                        placeholder="Enter course name"
                        style={inputStyle}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="courseDescription" style={labelStyle}>Description</label>
                    <textarea
                        id="courseDescription"
                        name="description"
                        value={newCourse.description}
                        onChange={handleInputChange}
                        rows={4}
                        className={styles.textarea}
                        required
                        placeholder="Enter course description"
                        style={inputStyle}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="courseColor" style={labelStyle}>Course Color</label>
                    <input
                        type="color"
                        id="courseColor"
                        value={newCourse.color}
                        onChange={handleColorChange}
                        className={styles.colorPicker}
                    />
                </div>
                {submitError && (
                    <div className={styles.errorMessage}>
                        {submitError}
                    </div>
                )}
                <div className={styles.buttonGroup}>
                    <button
                        type="button"
                        className={`${styles.button} ${styles.secondaryButton}`}
                        onClick={handleClose}
                        style={{
                            backgroundColor: backgroundColor2,
                            color: textColor
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={`${styles.button} ${styles.primaryButton}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Adding..." : "Add Course"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
