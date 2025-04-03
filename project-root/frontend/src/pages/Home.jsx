import React, { useState, useContext } from "react";
import styles from "../styles/home.module.css";
import Course from "../components/Course";
import Calendar from 'react-calendar';
import { GlobalContext } from "../context/GlobalContext";
import 'react-calendar/dist/Calendar.css';

export default function Home() {
    const [date, setDate] = useState(new Date());
    const { courses, coursesLoading, coursesError } = useContext(GlobalContext);

    const onChange = newDate => {
        setDate(newDate);
    };

    // Define fallback colors for courses that might not have a color
    const fallbackColors = [
        "rgba(0, 170, 255, 0.11)",
        "rgba(120, 255, 0, 0.11)",
        "rgba(255, 189, 0, 0.11)",
        "rgba(166, 0, 255, 0.11)",
        "rgba(255, 0, 0, 0.11)"
    ];

    const renderCoursesContent = () => {
        if (coursesLoading) {
            return <div className={styles.loading_message}>Loading courses...</div>;
        }

        if (coursesError) {
            return <div className={styles.error_message}>{coursesError}</div>;
        }

        if (!courses || courses.length === 0) {
            return <div className={styles.empty_message}>No courses found</div>;
        }

        // Take only the first 5 courses for the recent courses section
        const recentCourses = courses.slice(0, 5);

        return recentCourses.map((course, index) => (
            <Course
                key={course.id}
                name={course.name}
                description={course.description}
                teachers={course.teacher ? [course.teacher.name] : []}
                students={course.students ? course.students.length : 0}
                sections={course.sections ? course.sections.map(section => section.name) : []}
                color={course.color || fallbackColors[index % fallbackColors.length]}
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
