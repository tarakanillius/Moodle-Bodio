import React, {useState, useContext} from 'react';
import { FaTrash, FaDownload } from 'react-icons/fa';
import { GlobalContext } from "../../context/GlobalContext";
import { updateCourse, deleteCourse } from '../../handlers/courseHandlers';
import styles from "../../styles/courseDetail.module.css";

export default function SettingsTab({ course, userRole, onCourseUpdated }) {
    const { refreshCourses, backgroundColor2, textColor, BACKEND_URL } = useContext(GlobalContext);
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

        setSaving(true);
        setSaveMessage("");
        setSaveError("");

        try {
            const result = await updateCourse(BACKEND_URL, course.id, courseData);

            if (result.success) {
                setSaveMessage("Course settings saved successfully!");
                const updatedCourse = { ...course, ...courseData };
                if (onCourseUpdated) {
                    onCourseUpdated(updatedCourse);
                }
            } else {
                setSaveError(result.error || "Failed to save course settings");
            }
        } catch (error) {
            console.error("Error saving course:", error);
            setSaveError("An unexpected error occurred");
        } finally {
            setSaving(false);
            if (!saveError) {
                setTimeout(() => {
                    setSaveMessage("");
                }, 3000);
            }
        }
    };

    const handleExport = () => {
        alert("Course export functionality would be implemented here");
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
            try {
                setSaving(true);
                const result = await deleteCourse(BACKEND_URL, course.id);

                if (result.success) {
                    refreshCourses();
                    window.location.href = "/";
                } else {
                    setSaveError(result.error || "Failed to delete course. Please try again.");
                }
            } catch (error) {
                console.error("Error deleting course:", error);
                setSaveError("Failed to delete course. Please try again.");
            } finally {
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

            const studentResponse = await fetch(`${BACKEND_URL}/user_by_email/${studentEmail}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!studentResponse.ok) {
                const errorData = await studentResponse.json();
                setEnrollmentError(errorData.error || "Student not found with this email");
                setEnrollmentStatus("");
                return;
            }

            const studentData = await studentResponse.json();
            if (!studentData.user) {
                setEnrollmentError("Student not found with this email");
                setEnrollmentStatus("");
                return;
            }

            const enrollResponse = await fetch(`${BACKEND_URL}/enroll_student`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    student_id: studentData.user.id,
                    course_id: course.id
                })
            });

            if (enrollResponse.ok) {
                setEnrollmentStatus("Student enrolled successfully!");
                setStudentEmail("");

                const updatedCourseResponse = await fetch(`${BACKEND_URL}/course/${course.id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (updatedCourseResponse.ok) {
                    const updatedCourseData = await updatedCourseResponse.json();
                    if (onCourseUpdated) {
                        onCourseUpdated(updatedCourseData.course);
                    }
                }

                setTimeout(() => {
                    setEnrollmentStatus("");
                }, 3000);
            } else {
                const errorData = await enrollResponse.json();
                setEnrollmentError(errorData.error || "Failed to enroll student");
                setEnrollmentStatus("");
            }
        } catch (error) {
            console.error("Error enrolling student:", error);
            setEnrollmentError("An unexpected error occurred");
            setEnrollmentStatus("");
        }
    };

    return (
        <div className={styles.settingsContainer} style={{ backgroundColor: backgroundColor2 }}>
            <h2 className={styles.settingsTitle} style={{ color: textColor }}>Course Settings</h2>

            <div className={styles.settingsForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="courseName" style={{ color: textColor }}>Course Name</label>
                    <input
                        type="text"
                        id="courseName"
                        name="name"
                        value={courseData.name}
                        onChange={handleChange}
                        disabled={userRole !== "teacher" || saving}
                        style={{ backgroundColor: backgroundColor2, color: textColor }}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="courseDescription" style={{ color: textColor }}>Course description</label>
                    <textarea
                        id="courseDescription"
                        name="description"
                        value={courseData.description}
                        onChange={handleChange}
                        rows={4}
                        disabled={userRole !== "teacher" || saving}
                        style={{ backgroundColor: backgroundColor2, color: textColor }}
                    />
                </div>

                {userRole === "teacher" && (
                    <button
                        className={styles.button}
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                )}

                {saveMessage && (
                    <div className={styles.successMessage}>
                        {saveMessage}
                    </div>
                )}

                {saveError && (
                    <div className={styles.errorMessage}>
                        {saveError}
                    </div>
                )}
            </div>

            {userRole === "teacher" && (
                <>
                    <div className={styles.enrollmentSection}>
                        <h3 style={{ color: textColor }}>Enroll Student</h3>
                        <form onSubmit={handleEnrollStudent}>
                            <div className={styles.formGroup}>
                                <label htmlFor="studentEmail" style={{ color: textColor }}>Student Email</label>
                                <input
                                    type="email"
                                    id="studentEmail"
                                    value={studentEmail}
                                    onChange={(e) => setStudentEmail(e.target.value)}
                                    placeholder="Enter student email"
                                    style={{ backgroundColor: backgroundColor2, color: textColor }}
                                />
                            </div>

                            <button
                                type="submit"
                                className={styles.button}
                                disabled={!studentEmail || !!enrollmentStatus}
                            >
                                Enroll Student
                            </button>

                            {enrollmentStatus && (
                                <div className={styles.successMessage}>
                                    {enrollmentStatus}
                                </div>
                            )}

                            {enrollmentError && (
                                <div className={styles.errorMessage}>
                                    {enrollmentError}
                                </div>
                            )}
                        </form>
                    </div>

                    <div className={styles.courseActions}>
                        <button
                            className={styles.button}
                            onClick={handleExport}
                        >
                            <FaDownload /> Export Course
                        </button>

                        <button
                            className={styles.button}
                            style={{backgroundColor: "white", color: "#e53e3e"}}
                            onClick={handleDelete}
                            disabled={saving}
                        >
                            <FaTrash /> Delete Course
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

