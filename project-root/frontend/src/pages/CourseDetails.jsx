import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from "../context/GlobalContext";
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import TabNav from "../components/TabNav";
import SectionsTab from "../components/courseDetails/SectionsTab";
import StudentsTab from "../components/courseDetails/StudentsTab";
import SettingsTab from "../components/courseDetails/SettingsTab";
import styles from "../styles/courseDetail.module.css";

export default function CourseDetail({ courseId }) {
    const { setSelectedComponent, user } = useContext(GlobalContext);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState(null);
    const [activeTab, setActiveTab] = useState("sections");
    const [completedSections, setCompletedSections] = useState([]);

    const courseTabs = [
        { id: "sections", label: "Sections" },
        { id: "students", label: "Students" },
        { id: "settings", label: "Settings", disabled: user.role !== "teacher" }
    ];

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://127.0.0.1:5000/course/${courseId}`);
                setCourse(response.data.course);

                if (response.data.course.sections && response.data.course.sections.length > 0) {
                    setActiveSection(response.data.course.sections[0].id);
                }

                //TODO: fetch the completed sections from the backend
                setCompletedSections([]);
            } catch (err) {
                console.error("Error fetching course details:", err);
                setError("Failed to load course details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchCourseDetails();
        }
    }, [courseId]);

    const handleBackClick = () => {
        setSelectedComponent("modules");
    };

    const toggleSectionCompletion = (sectionId) => {
        if (completedSections.includes(sectionId)) {
            setCompletedSections(completedSections.filter(id => id !== sectionId));
        } else {
            setCompletedSections([...completedSections, sectionId]);
        }
    };

    if (loading) {
        return <div className={styles.loadingMessage}>Loading course details...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    if (!course) {
        return <div className={styles.errorMessage}>Course not found</div>;
    }

    return (
        <div className={styles.courseDetailContainer}>
            <div className={styles.courseHeader}>
                <button className={styles.backButton} onClick={handleBackClick}>
                    <FaArrowLeft /> Back to Courses
                </button>
                <h1 className={styles.courseTitle}>{course.name}</h1>
                <p className={styles.courseDescription}>{course.description}</p>
            </div>
            <TabNav
                tabs={courseTabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                className={styles.courseNav}
            />
            {activeTab === "sections" && (
                <SectionsTab
                    course={course}
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    userRole={user.role}
                    completedSections={completedSections}
                    toggleSectionCompletion={toggleSectionCompletion}
                />
            )}
            {activeTab === "students" && (
                <StudentsTab course={course} />
            )}
            {activeTab === "settings" && user.role === "teacher" && (
                <SettingsTab course={course} userRole={user.role} />
            )}
        </div>
    );
}
