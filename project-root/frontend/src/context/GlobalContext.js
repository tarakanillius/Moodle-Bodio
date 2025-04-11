import React, { createContext, useState, useEffect } from 'react';
import { verifyToken, updateUserInContext, clearUserFromContext } from '../handlers/userHandlers';
import { fetchCourses, getCourse, handleUnenrollStudent, filterCourses } from '../handlers/courseHandlers';
import { submitQuiz, getQuizResults } from '../handlers/quizHandlers';
import { getThemeSettings, toggleDarkMode as toggleTheme, initializeTheme} from '../handlers/themeHandlers';
import axiosInstance from '../utils/axiosConfig';

export const GlobalContext = createContext(undefined);

export const GlobalProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedComponent, setSelectedComponent] = useState("modules");
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [coursesLoading, setCoursesLoading] = useState(false);
    const [coursesLoaded, setCoursesLoaded] = useState(false);
    const [coursesError, setCoursesError] = useState(null);
    const [darkMode, setDarkMode] = useState(initializeTheme());
    const [activeTab, setActiveTab] = useState("sections");
    const { backgroundColor, backgroundColor2, textColor } = getThemeSettings(darkMode);
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const result = await verifyToken(BACKEND_URL);
                    if (result.success) {
                        setUser(result.user);
                        setIsAuthenticated(true);
                    } else {
                        clearUserFromContext();
                        setIsAuthenticated(false);
                        setUser(null);
                    }
                } catch (error) {
                    clearUserFromContext();
                    setIsAuthenticated(false);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, [BACKEND_URL]);

    useEffect(() => {
        if (isAuthenticated && !coursesLoaded) {
            handleInitialCourseLoad();
        }
    }, [isAuthenticated, coursesLoaded]);

    const handleToggleDarkMode = () => {
        const newDarkMode = toggleTheme(darkMode);
        setDarkMode(newDarkMode);
    };

    const handleUpdateUser = (userData, token = null) => {
        if (!userData.role || !userData.sex) {
            console.error("User data missing required properties:", userData);
        }

        const updatedUser = updateUserInContext(userData, token);
        setUser(updatedUser);
        setIsAuthenticated(true);
    };

    const handleClearUser = () => {
        clearUserFromContext();
        setIsAuthenticated(false);
        setUser(null);
    };

    const handleFetchCourses = async () => {
        if (!isAuthenticated || coursesLoading) return;

        setCoursesLoading(true);
        setCoursesError(null);

        const result = await fetchCourses(BACKEND_URL);
        if (result.success) {
            setCourses(result.courses);
            setFilteredCourses(result.courses);
        } else {
            setCoursesError(result.error);
        }

        setCoursesLoading(false);
    };

    const handleInitialCourseLoad = async () => {
        if (coursesLoaded || !isAuthenticated || coursesLoading) return;

        setCoursesLoading(true);
        setCoursesError(null);

        const result = await fetchCourses(BACKEND_URL);
        if (result.success) {
            setCourses(result.courses);
            setFilteredCourses(result.courses);
            setCoursesLoaded(true);
        } else {
            setCoursesError(result.error);
        }

        setCoursesLoading(false);
    };

    const handleSearchCourses = (searchQuery) => {
        const query = searchQuery || '';
        const filtered = filterCourses(courses, query);
        setFilteredCourses(filtered);
    };

    const handleGetCourse = (courseId) => {
        return getCourse(courses, courseId);
    };

    const handleUnenrollStudentFromCourse = async (studentId, courseId) => {
        return await handleUnenrollStudent(BACKEND_URL, studentId, courseId);
    };

    const handleSubmitQuiz = async (quizId, answers) => {
        return await submitQuiz(BACKEND_URL, quizId, user.id, answers);
    };

    const handleGetQuizResults = async (quizId) => {
        return await getQuizResults(BACKEND_URL, quizId, user.id);
    };

    return (
        <GlobalContext.Provider
            value={{
                isAuthenticated,
                user,
                loading,
                updateUser: handleUpdateUser,
                clearUser: handleClearUser,
                selectedComponent,
                setSelectedComponent,
                selectedCourseId,
                setSelectedCourseId,
                courses,
                filteredCourses,
                setFilteredCourses: handleSearchCourses,
                coursesLoading,
                coursesError,
                getCourse: handleGetCourse,
                darkMode,
                toggleDarkMode: handleToggleDarkMode,
                backgroundColor,
                backgroundColor2,
                textColor,
                BACKEND_URL,
                handleUnenrollStudent: handleUnenrollStudentFromCourse,
                submitQuiz: handleSubmitQuiz,
                getQuizResults: handleGetQuizResults,
                fetchCourses: handleFetchCourses,
                initialLoadCourses: handleInitialCourseLoad,
                refreshCourses: handleFetchCourses,
                activeTab,
                setActiveTab
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
