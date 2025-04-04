import React, { useState, useEffect, useContext } from 'react';
import { FaSearch, FaList, FaTh } from 'react-icons/fa';
import styles from "../styles/courses.module.css";
import Course from "../components/Course";
import { GlobalContext } from "../context/GlobalContext";

export default function Courses() {
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCourses, setFilteredCourses] = useState([]);
    const { courses, coursesLoading, coursesError } = useContext(GlobalContext);

    useEffect(() => {
        if (courses) {
            handleSearch();
        }
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

    return (
        <div className={styles.coursesContainer}>
            <div className={styles.searchBarContainer}>
                <div className={styles.searchInputWrapper}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
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
                    <button
                        className={styles.searchBtn}
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>
            </div>
            {coursesLoading ? (
                <div className={styles.loadingMessage}>Loading courses...</div>
            ) : coursesError ? (
                <div className={styles.errorMessage}>{coursesError}</div>
            ) : filteredCourses.length === 0 ? (
                <div className={styles.noCoursesMessage}>
                    {searchQuery ? "No courses match your search" : "No courses found"}
                </div>
            ) : (
                <div className={`${styles.coursesList} ${styles[viewMode]}`}>
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
        </div>
    );
}
