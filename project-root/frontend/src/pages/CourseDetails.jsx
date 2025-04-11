import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import styles from '../styles/courseDetail.module.css';
import TabNav from '../components/TabNav';
import Settings from '../components/courseDetails/SettingsTab';
import StudentsTab from '../components/courseDetails/StudentsTab';
import SectionsTab from '../components/courseDetails/SectionsTab';
import { getCourseById } from '../handlers/courseHandlers';
import { getCompletedSections, toggleSectionCompletion } from '../handlers/sectionHandlers';

export default function CourseDetails({ courseId }) {
    const {
        user,
        backgroundColor,
        backgroundColor2,
        textColor,
        BACKEND_URL,
        activeTab,
        setActiveTab
    } = useContext(GlobalContext);

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState(null);
    const [completedSections, setCompletedSections] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                setLoading(true);

                if (!courseId || !/^[0-9a-fA-F]{24}$/.test(courseId)) {
                    setError("Invalid course ID format");
                    setLoading(false);
                    return;
                }

                const result = await getCourseById(BACKEND_URL, courseId);

                if (result.success) {
                    setCourse(result.course);

                    if (result.course.sections && result.course.sections.length > 0) {
                        setActiveSection(result.course.sections[0].id);
                    }
                } else {
                    setError(result.error);
                }
            } catch (err) {
                console.error("Error fetching course details:", err);
                setError("Failed to load course details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [BACKEND_URL, courseId, refreshTrigger]);


    useEffect(() => {
        const fetchCompletedSections = async () => {
            if (user && user.role === 'student' && courseId) {
                try {
                    const result = await getCompletedSections(BACKEND_URL, user.id, courseId);
                    if (result.success) {
                        setCompletedSections(result.data);
                    }
                } catch (err) {
                    console.error("Error fetching completed sections:", err);
                }
            }
        };

        fetchCompletedSections();
    }, [BACKEND_URL, user, courseId]);

    const handleToggleSectionCompletion = async (sectionId) => {
        if (!user || user.role !== 'student') return;

        const isCompleted = completedSections.includes(sectionId);

        try {
            const result = await toggleSectionCompletion(
                BACKEND_URL,
                user.id,
                sectionId,
                !isCompleted
            );

            if (result.success) {
                if (isCompleted) {
                    setCompletedSections(prev => prev.filter(id => id !== sectionId));
                } else {
                    setCompletedSections(prev => [...prev, sectionId]);
                }
            }
        } catch (err) {
            console.error("Error toggling section completion:", err);
        }
    };

    const handleCourseUpdated = (updatedCourse) => {
        setCourse(updatedCourse);
    };

    const tabs = [
        { id: "sections", label: "Sections" },
        { id: "students", label: "Students" },
        { id: "settings", label: "Settings" }
    ];

    if (loading) {
        return (
            <div className={styles.loadingContainer} style={{ backgroundColor }}>
                <div className={styles.loadingMessage} style={{ color: textColor }}>
                    Loading course details...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer} style={{ backgroundColor }}>
                <div className={styles.errorMessage}>
                    {error}
                </div>
                <button
                    className={styles.backButton}
                    onClick={() => window.location.reload()}
                >
                    Back to Courses
                </button>
            </div>
        );
    }

    return (
        <div className={styles.courseDetailContainer} style={{ backgroundColor: backgroundColor2 }}>
            <div className={styles.courseHeader}>
                <h1 className={styles.courseTitle} style={{ color: textColor }}>
                    {course?.name}
                </h1>
                <p className={styles.courseDescription} style={{ color: textColor }}>
                    {course?.description}
                </p>
            </div>

            <TabNav
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            <div className={styles.tabContent}>
                {activeTab === "sections" && (
                    <SectionsTab
                        course={course}
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                        userRole={user?.role}
                        completedSections={completedSections}
                        toggleSectionCompletion={handleToggleSectionCompletion}
                        onCourseUpdated={handleCourseUpdated}
                    />
                )}
                {activeTab === "settings" && (
                    <Settings
                        course={course}
                        userRole={user?.role}
                        onCourseUpdated={handleCourseUpdated}
                    />
                )}
                {activeTab === "students"  && (
                    <StudentsTab
                        course={course}
                        onStudentUnenrolled={() => setRefreshTrigger(prev => prev + 1)}
                    />
                )}
            </div>
        </div>
    );
}
