import React, {useState, useEffect, useContext} from 'react';
import { FaSearch, FaList, FaTh, FaPlus } from 'react-icons/fa';
import styles from "../styles/courses.module.css";
import modalStyles from "../styles/modal.module.css";
import Course from "../components/Course";
import Modal from "../components/Modal";
import {GlobalContext} from "../context/GlobalContext";
import axiosInstance from "../utils/axiosConfig";

export default function Courses() {
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const {courses, filteredCourses, setFilteredCourses, loading, error, fetchCourses, theme, user, BACKEND_URL} = useContext(GlobalContext);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const canAddCourse = user && user.role === 'teacher';
    const [newCourse, setNewCourse] = useState({
        name: '',
        description: '',
        color: 'rgba(0, 170, 255, 0.5)'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [searchQuery, courses]);

    const toggleViewMode = () => {
        setViewMode(viewMode === 'grid' ? 'list' : 'grid');
    };

    const handleSearch = () => {
        if (!searchQuery.trim()) {
            setFilteredCourses(courses);
            return;
        }
        const query = searchQuery.toLowerCase();
        const filtered = courses.filter(course =>
            course.name.toLowerCase().includes(query) ||
            course.description.toLowerCase().includes(query)
        );
        setFilteredCourses(filtered);
    };

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

        try {
            const response = await axiosInstance.post(`${BACKEND_URL}/add_course`, {
                name: newCourse.name,
                description: newCourse.description,
                teacherId: user.id,
                color: newCourse.color
            });

            setIsAddModalOpen(false);
            setNewCourse({
                name: '',
                description: '',
                color: 'rgba(0, 170, 255, 0.5)'
            });

            fetchCourses();

        } catch (error) {
            console.error("Error adding course:", error);
            setSubmitError(error.response?.data?.error || "Failed to add course. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

// Keep the existing imports and functionality
// Only updating the JSX structure for better layout

// Keep the existing imports and functionality
// Only updating the JSX structure to fix the right edge overflow

    return (
        <div className={styles.coursesContainer} style={{
            backgroundColor: theme === "Dark" ? "#1a1a1a" : "#ffffff",
            overflowX: "hidden" // Prevent horizontal overflow
        }}>
            <h2 style={{
                color: theme === "Dark" ? "#ffffff" : "#333333",
                marginBottom: "20px",
                fontSize: "28px",
                width: "100%",
                boxSizing: "border-box"
            }}>
                My Courses
            </h2>

            <div className={styles.searchBarContainer} style={{
                backgroundColor: theme === "Dark" ? "#2d2d2d" : "#f5f5f5",
                width: "100%",
                boxSizing: "border-box"
            }}>
                <div className={styles.searchInputWrapper} style={{
                    backgroundColor: theme === "Dark" ? "#3d3d3d" : "#ffffff",
                    flex: "1 1 auto"
                }}>
                    <FaSearch className={styles.searchIcon} style={{ color: theme === "Dark" ? "#aaaaaa" : "#666666" }} />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                        style={{ color: theme === "Dark" ? "#ffffff" : "#333333" }}
                    />
                </div>
                <div className={styles.actionButtons}>
                    <button
                        className={styles.viewToggleBtn}
                        onClick={toggleViewMode}
                        title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
                    >
                        {viewMode === 'grid' ? <FaList /> : <FaTh />}
                    </button>

                    {canAddCourse && (
                        <button
                            className={styles.viewToggleBtn}
                            onClick={() => setIsAddModalOpen(true)}
                            title="Add new course"
                            style={{ backgroundColor: "#4CAF50" }}
                        >
                            <FaPlus />
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className={styles.loadingMessage} style={{ color: theme === "Dark" ? "#bbbbbb" : "#666666" }}>
                    Loading courses...
                </div>
            ) : error ? (
                <div className={styles.errorMessage}>
                    {error}
                </div>
            ) : filteredCourses.length === 0 ? (
                <div className={styles.noCoursesMessage} style={{ color: theme === "Dark" ? "#bbbbbb" : "#718096" }}>
                    {searchQuery ? "No courses match your search" : "No courses found"}
                </div>
            ) : (
                <div className={`${styles.coursesList} ${styles[viewMode]}`} style={{
                    width: "100%",
                    boxSizing: "border-box"
                }}>
                    {filteredCourses.map(course => (
                        <Course
                            key={course.id}
                            viewMode={viewMode}
                            name={course.name}
                            description={course.description}
                            teachers={course.teacher ? [course.teacher.name] : []}
                            students={course.students ? course.students.length : 0}
                            sections={course.sections ? course.sections.map(section => section.name) : []}
                            courseId={course.id}
                            color={course.color}
                        />
                    ))}
                </div>
            )}
            {/* Add Course Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Course"
                theme={theme}
            >
                <form onSubmit={handleAddCourse}>
                    <div className={modalStyles.formGroup}>
                        <label htmlFor="courseName">Course Name</label>
                        <input
                            type="text"
                            id="courseName"
                            name="name"
                            value={newCourse.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className={modalStyles.formGroup}>
                        <label htmlFor="courseDescription">Description</label>
                        <textarea
                            id="courseDescription"
                            name="description"
                            value={newCourse.description}
                            onChange={handleInputChange}
                            rows={4}
                            required
                        />
                    </div>
                    <div className={modalStyles.colorPickerGroup}>
                        <label htmlFor="courseColor">Course Color</label>
                        <input
                            type="color"
                            id="courseColor"
                            value={newCourse.color.startsWith('rgba') ? '#00aaff' : newCourse.color}
                            onChange={handleColorChange}
                        />
                    </div>
                    {submitError && (
                        <div className={modalStyles.errorMessage}>
                            {submitError}
                        </div>
                    )}
                    <div className={modalStyles.buttonGroup}>
                        <button
                            type="button"
                            className={`${modalStyles.button} ${modalStyles.secondaryButton}`}
                            onClick={() => setIsAddModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`${modalStyles.button} ${modalStyles.primaryButton}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Adding..." : "Add Course"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
