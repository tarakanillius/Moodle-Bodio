import React, {useState, useContext, useEffect} from "react";
import styles from "../styles/home.module.css";
import courseStyles from "../styles/courses.module.css";
import Course from "../components/Course";
import Calendar from 'react-calendar';
import { GlobalContext } from "../context/GlobalContext";
import 'react-calendar/dist/Calendar.css';

export default function Home() {
    const [date, setDate] = useState(new Date());
    const {courses, loading, error, fetchCourses, theme} = useContext(GlobalContext);

    useEffect(() => {
        fetchCourses();
    }, []);

    const onChange = newDate => {
        setDate(newDate);
    };

    const renderCoursesContent = () => {
        if (loading) return <div className={styles.loading_message}>Loading courses...</div>;
        if (error) return <div className={styles.error_message}>{error}</div>;
        if (!courses || courses.length === 0) return <div className={styles.empty_message}>No courses found</div>;
        const recentCourses = courses.slice(0, 5);

        return (
            <div className={`${courseStyles['grid']}`}>
                {recentCourses.map((course) => (
                    <Course
                        key={course.id}
                        viewMode={'grid'}
                        name={course.name}
                        description={course.description}
                        teachers={course.teacher ? [course.teacher.name] : []}
                        students={course.students ? course.students.length : 0}
                        sections={course.sections ? course.sections.map(section => section.name) : []}
                        color={course.color}
                        courseId={course.id}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className={styles.body} style={{ backgroundColor: theme === "Dark" ? "#1a1a1a" : "#ffffff" }}>
            <div className={styles.header}>
                <img
                    className={styles.logo_ameti}
                    src="/assets/logo_ameti.jpeg"
                    alt="AMETI Logo"
                />
                <div className={styles.welcome_text}>
                    <h1 style={{ color: theme === "Dark" ? "#ffffff" : "#333333" }}>
                        Welcome to m0.0dle Learning Platform
                    </h1>
                    <p style={{ color: theme === "Dark" ? "#bbbbbb" : "#666666" }}>
                        Your personalized learning dashboard
                    </p>
                </div>
            </div>

            <div className={styles.recent_courses_container} style={{ backgroundColor: theme === "Dark" ? "#2d2d2d" : "#f9f9f9" }}>
                <div className={styles.section_header}>
                    <h3 style={{ color: theme === "Dark" ? "#ffffff" : "#333333" }}>Recently Visited Courses</h3>
                </div>
                {renderCoursesContent()}
            </div>

            <div className={styles.calendar_container} style={{ backgroundColor: theme === "Dark" ? "#2d2d2d" : "#f9f9f9" }}>
                <div className={styles.section_header}>
                    <h3 style={{ color: theme === "Dark" ? "#ffffff" : "#333333" }}>Calendar</h3>
                </div>
                <div className={styles.calendarContainer}>
                    <Calendar
                        onChange={onChange}
                        value={date}
                        className={styles.calendarBody}
                        tileClassName={({ date, view }) =>
                            view === 'month' && date.getDay() === 0 ? 'sunday' : null
                        }
                    />
                </div>
            </div>
        </div>
    );
}
