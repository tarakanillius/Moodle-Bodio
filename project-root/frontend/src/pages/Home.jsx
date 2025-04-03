import React, { useState, useEffect } from "react";
import styles from "../styles/home.module.css";
import Course from "../components/Course";
import Calendar from 'react-calendar';
import { fetchUserCourses } from "../utils/courseService";
import 'react-calendar/dist/Calendar.css';

export default function Home() {
    const [date, setDate] = useState(new Date());
    const [recentCourses, setRecentCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCourses = async () => {
            try {
                setLoading(true);
                const userId = localStorage.getItem('userId');

                if (!userId) {
                    setError("User not logged in");
                    return;
                }

                const courses = await fetchUserCourses(userId);

                setRecentCourses(courses.slice(0, 5));
            } catch (err) {
                console.error("Failed to load courses:", err);
                setError("Failed to load courses. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        loadCourses();
    }, []);

    const onChange = newDate => {
        setDate(newDate);
    };

    const renderCoursesContent = () => {
        if (loading) {
            return <div className={styles.loading_message}>Loading courses...</div>;
        }

        if (error) {
            return <div className={styles.error_message}>{error}</div>;
        }

        if (recentCourses.length === 0) {
            return <div className={styles.empty_message}>No courses found</div>;
        }

        return recentCourses.map((course) => (
            <Course
                key={course.id}
                name={course.name}
                description={course.description}
                teachers={course.teacher ? [course.teacher.name] : []}
                students={course.students ? course.students.length : 0}
                sections={course.sections ? course.sections.map(section => section.name) : []}
                color={course.color}
                courseId={course.id}
            />
        ));
    };

    return (
        <div className={styles.body}>
            <div className={styles.header}>
                <img
                    className={styles.logo_ameti}
                    src="/assets/logo_ameti.jpeg"
                    alt="AMETI Logo"
                />
            </div>

            <div className={styles.section_header}>
                <h3>Corsi visitati di recente</h3>
            </div>
            <div className={styles.home_body}>
                {renderCoursesContent()}
            </div>

            <div className={styles.calendar_container}>
                <div className={styles.section_header}>
                    <h3>Calendario</h3>
                </div>
                <div className={styles.calendar}>
                    <Calendar
                        onChange={onChange}
                        value={date}
                        className="react-calendar"
                    />
                </div>
            </div>
        </div>
    );
}
