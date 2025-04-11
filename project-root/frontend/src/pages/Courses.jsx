import React, {useState, useEffect, useContext} from 'react';
import { FaSearch, FaList, FaTh, FaPlus } from 'react-icons/fa';
import styles from "../styles/courses.module.css";
import Course from "../components/Course";
import {GlobalContext} from "../context/GlobalContext";
import AddCourseModal from "../components/modals/AddCourseModal";

export default function Courses() {
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [localFilteredCourses, setLocalFilteredCourses] = useState([]);

    const {
        courses,
        loading,
        error,
        refreshCourses,
        backgroundColor,
        backgroundColor2,
        textColor,
        user,
    } = useContext(GlobalContext);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const canAddCourse = user && user.role === 'teacher';

    useEffect(() => {
        if (courses) {
            const query = searchQuery.toLowerCase();

            const filtered = courses.filter(course => {
                const nameMatch = course.name.toLowerCase().includes(query);
                const descriptionMatch = course.description &&
                    course.description.toLowerCase().includes(query);

                const sectionMatch = course.sections && course.sections.some(section =>
                    section.name.toLowerCase().includes(query)
                );

                return nameMatch || descriptionMatch || sectionMatch;
            });

            setLocalFilteredCourses(filtered);
        }
    }, [searchQuery, courses]);

    const toggleViewMode = () => {
        setViewMode(viewMode === 'grid' ? 'list' : 'grid');
    };

    return (
        <div className={styles.coursesContainer} style={{backgroundColor: backgroundColor}}>
            <h2 style={{
                color: textColor,
                marginBottom: "20px",
                fontSize: "28px",
                width: "100%",
                boxSizing: "border-box"
            }}>
                My Courses
            </h2>

            <div className={styles.searchBarContainer} style={{backgroundColor: backgroundColor2}}>
                <div className={styles.searchInputWrapper} style={{backgroundColor: backgroundColor}}>
                    <FaSearch className={styles.searchIcon} style={{ color: textColor}} />
                    <input
                        type="text"
                        placeholder="Search courses and sections..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                        style={{ color: textColor}}
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
                            style={{ backgroundColor: "#636363" }}
                        >
                            <FaPlus />
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className={styles.loadingMessage} style={{ color: textColor}}>
                    Loading courses...
                </div>
            ) : error ? (
                <div className={styles.errorMessage}>
                    {error}
                </div>
            ) : localFilteredCourses.length === 0 ? (
                <div className={styles.noCoursesMessage} style={{ backgroundColor: backgroundColor2 ,color: textColor}}>
                    {searchQuery ? "No courses or sections match your search" : "No courses found"}
                </div>
            ) : (
                <div className={`${styles.coursesList} ${styles[viewMode]}`}>
                    {localFilteredCourses.map(course => (
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
                            highlightedSections={searchQuery ?
                                course.sections?.filter(section =>
                                    section.name.toLowerCase().includes(searchQuery.toLowerCase())
                                ).map(section => section.name) : []
                            }
                        />
                    ))}
                </div>
            )}

            <AddCourseModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onCourseAdded={refreshCourses}
            />
        </div>
    );
}
