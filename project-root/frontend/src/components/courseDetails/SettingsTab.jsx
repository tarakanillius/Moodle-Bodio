import React, {useState, useContext} from 'react';
import { FaTrash, FaDownload } from 'react-icons/fa';
import { GlobalContext } from "../../context/GlobalContext";
import axios from 'axios';
import styles from "../../styles/courseDetail.module.css";

export default function SettingsTab({ course, userRole, onCourseUpdated }) {
    const { updateCourse, refreshCourses } = useContext(GlobalContext);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");
    const [saveError, setSaveError] = useState("");
    const [studentEmail, setStudentEmail] = useState("");
    const [enrollmentStatus, setEnrollmentStatus] = useState("");
    const [enrollmentError, setEnrollmentError] = useState("");
    const [courseData, setCourseData] = useState({
        name: course.name,
        description: course.description
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseData({ ...courseData, [name]: value });
    };

    const handleSave = async () => {
        if (userRole !== "teacher") return;
        try {
            const result = await updateCourse(course.id, courseData);
            setSaving(true);
            setSaveMessage("");
            setSaveError("");
            if (result.success) {
                setSaveMessage("Course settings saved successfully!");
                const updatedCourse = { ...course, ...courseData };
                if (onCourseUpdated) {onCourseUpdated(updatedCourse);}
            } else {setSaveError(result.error || "Failed to save course settings");}
        } catch (error) {
            console.error("Error saving course:", error);
            setSaveError("An unexpected error occurred");
        } finally {
            setSaving(false);
            if (!saveError) {setTimeout(() => {setSaveMessage("");}, 3000)}
        }
    };

    const handleExport = () => {
        alert("Course export functionality would be implemented here");
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
            try {
                setSaving(true);
                await axios.delete(`http://127.0.0.1:5000/delete_course/${course.id}`);
                refreshCourses();
                window.location.href = "/";
            } catch (error) {
                console.error("Error deleting course:", error);
                setSaveError("Failed to delete course. Please try again.");
                setSaving(false);
            }
        }
    };

    const handleEnrollStudent = async (e) => {
        e.preventDefault();
        if (!studentEmail) {
            setEnrollmentError("Please enter a student email");
            return;
        }
        try {
            setEnrollmentStatus("Enrolling student...");
            setEnrollmentError("");
            const studentResponse = await axios.get(`http://127.0.0.1:5000/user_by_email/${studentEmail}`);
            if (!studentResponse.data.user) {
                setEnrollmentError("Student not found with this email");
                setEnrollmentStatus("");
                return;
            }
            await axios.post(`http://127.0.0.1:5000/enroll_student`, {
                student_id: studentResponse.data.user.id,
                course_id: course.id
            });
            setEnrollmentStatus("Student enrolled successfully!");
            setStudentEmail("");
            const updatedCourseResponse = await axios.get(`http://127.0.0.1:5000/course/${course.id}`);
            if (onCourseUpdated && updatedCourseResponse.data.course) {onCourseUpdated(updatedCourseResponse.data.course);}
            setTimeout(() => {setEnrollmentStatus("");}, 3000);
        } catch (error) {
            console.error("Error enrolling student:", error);
            setEnrollmentError(error.response?.data?.error || "Failed to enroll student");
            setEnrollmentStatus("");
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
                        disabled={userRole !== "teacher" || saving}
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
                        disabled={userRole !== "teacher" || saving}
                    />
                </div>
                {saveMessage && (
                    <div className={styles.saveMessage}>
                        {saveMessage}
                    </div>
                )}
                {saveError && (
                    <div className={styles.saveError}>
                        {saveError}
                    </div>
                )}
                    <div className={styles.enrollForm}>
                        <h3>Enroll Student</h3>
                        <form onSubmit={handleEnrollStudent}>
                            <div className={styles.formGroup}>
                                <label htmlFor="studentEmail">Student Email</label>
                                <input
                                    type="email"
                                    id="studentEmail"
                                    value={studentEmail}
                                    onChange={(e) => setStudentEmail(e.target.value)}
                                    placeholder="Enter student email"
                                    required
                                />
                            </div>
                            {enrollmentStatus && (
                                <div className={styles.saveMessage}>
                                    {enrollmentStatus}
                                </div>
                            )}
                            {enrollmentError && (
                                <div className={styles.saveError}>
                                    {enrollmentError}
                                </div>
                            )}
                            <div className={styles.buttonGroup}>
                                <button
                                    type="submit"
                                    className={styles.button}
                                    disabled={!studentEmail}
                                >
                                    Enroll
                                </button>
                            </div>
                        </form>
                    </div>
            </div>
            <div className={styles.courseActions}>
                {userRole === "teacher" && (
                    <button
                        className={styles.button}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                )}
                <button className={styles.button} onClick={handleExport} disabled={saving}>
                    <FaDownload /> Export Course
                </button>
                {userRole === "teacher" && (
                    <button
                        className={styles.deleteButton}
                        onClick={handleDelete}
                        disabled={saving}
                    >
                        <FaTrash /> Delete Course
                    </button>
                )}
            </div>
        </div>
    );
}
