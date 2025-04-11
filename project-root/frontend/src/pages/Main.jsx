import React, { useContext, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import Sidebar from '../components/Sidebar';
import Courses from './Courses';
import CourseDetail from './CourseDetails';
import Settings from './Settings';
import UserData from './UserData';
import styles from '../styles/main.module.css';
import Home from "./Home";

export default function Main() {
    const {
        selectedComponent,
        selectedCourseId,
        initialLoadCourses,
        backgroundColor,
    } = useContext(GlobalContext);

    useEffect(() => {
        initialLoadCourses();
    }, []);

    const renderComponent = () => {
        switch (selectedComponent) {
            case 'home':
                return <Home />
            case 'modules':
                return <Courses />;
            case 'course':
                return <CourseDetail courseId={selectedCourseId} />;
            case 'settings':
                return <Settings />;
            case 'userData':
                return <UserData />;
            default:
                return <Courses />;
        }
    };

    return (
        <div className={styles.wrapper}>
            <Sidebar />
            <div className={styles.content} style={{ backgroundColor}}>
                {renderComponent()}
            </div>
        </div>
    );
}
