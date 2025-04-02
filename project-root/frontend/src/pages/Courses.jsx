import React, { useState, useEffect } from 'react';
import { FaSearch, FaList, FaTh } from 'react-icons/fa';
import axios from 'axios';
import styles from "../styles/courses.module.css";
import Course from "../components/Course";

export default function Courses() {
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const userId = localStorage.getItem('userId');

                if (!userId) {
                    setError("User not logged in");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`http://127.0.0.1:5000/student_courses/${userId}`);

                if (response.data.courses) {
                    const coursesWithDetails = await Promise.all(
                        response.data.courses.map(async (course) => {
                            try {
                                const detailsResponse = await axios.get(`http://127.0.0.1:5000/course/${course.id}`);
                                return detailsResponse.data.course;
                            } catch (err) {
                                console.error(`Error fetching details for course ${course.id}:`, err);
                                return course;
                            }
                        })
                    );

                    setCourses(coursesWithDetails);
                    setFilteredCourses(coursesWithDetails);
                } else {
                    setCourses([]);
                    setFilteredCourses([]);
                }
            } catch (err) {
                console.error("Error fetching courses:", err);
                setError("Failed to load courses. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

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

    useEffect(() => {
        handleSearch();
    }, [searchQuery]);

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

            <div className={`${styles.coursesList} ${styles[viewMode]}`}>
                <Course
                    name="M320"
                    description="Programmazione orientata a oggetti"
                    teachers={["Davide Krähenbühl"]}
                    students={16}
                    sections={["Basics", "Variables", "Functions", "Objects"]}
                    color={"rgba(0, 170, 255, 0.11)"}
                />
                <Course
                    name="M293"
                    description="Creare e pubblicare una pagina web"
                    teachers={["Gionata Genazzi"]}
                    students={8}
                    sections={["Basics", "Variables", "Functions", "Objects"]}
                    color={"rgba(120, 255, 0, 0.11)"}
                />
                <Course
                    name="M426"
                    description="Sviluppare software con metodi agili"
                    teachers={["Gionata Genazzi"]}
                    students={8}
                    sections={["Basics", "Variables", "Functions", "Objects"]}
                    color={"rgba(255, 189, 0, 0.11)"}
                />
                <Course
                    name="M165"
                    description="Utilizzare banche dati NoSQL"
                    teachers={["Simone Debortoli"]}
                    students={8}
                    sections={["Basics", "Variables", "Functions", "Objects"]}
                    color={"rgba(166, 0, 255, 0.11)"}
                />
                <Course
                    name="322"
                    description="Sviluppare interfacce grafiche"
                    teachers={["Davide Krähenbühl"]}
                    students={8}
                    sections={["Basics", "Variables", "Functions", "Objects"]}
                    color={"rgba(255, 0, 0, 0.11)"}
                />
            </div>
            {loading ? (
                <div className={styles.loadingMessage}>Loading courses...</div>
            ) : error ? (
                <div className={styles.errorMessage}>{error}</div>
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
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
