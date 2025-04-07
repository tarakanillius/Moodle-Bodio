import React, {useState, useContext, useEffect} from "react";
import styles from "../styles/home.module.css";
import Course from "../components/Course";
import Calendar from 'react-calendar';
import { GlobalContext } from "../context/GlobalContext";
import 'react-calendar/dist/Calendar.css';

export default function Home() {
    const [date, setDate] = useState(new Date());
    const {courses,loading,error,fetchCourses} = useContext(GlobalContext);

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
                <div className={styles.calendarContainer}>
                    <Calendar
                        onChange={onChange}
                        value={date}
                        className={styles.calendarBody}
                    />
                </div>
            </div>
        </div>
    );
}
