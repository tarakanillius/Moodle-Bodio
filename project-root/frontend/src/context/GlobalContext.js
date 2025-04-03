import {createContext, useEffect, useState} from "react";
import axios from 'axios';

export const GlobalContext = createContext(undefined, undefined);

export default function GlobalProvider({ children }) {
    const [selectedComponent, setSelectedComponent] = useState("home");
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [courses, setCourses] = useState([]);
    const [coursesLoaded, setCoursesLoaded] = useState(false);
    const [coursesLoading, setCoursesLoading] = useState(false);
    const [coursesError, setCoursesError] = useState(null);

    const [user, setUser] = useState({
        id: "",
        name: "",
        surname: "",
        email: "",
        role: "",
        gender: "",
    });

    useEffect(() => {
        if (localStorage.getItem("userId")) {
            const userId = localStorage.getItem("userId");
            const userName = localStorage.getItem("userName");
            const userSurname = localStorage.getItem("userSurname");
            const userEmail = localStorage.getItem("userEmail");
            const userRole = localStorage.getItem("userRole");
            const userGender = localStorage.getItem("userGender");
            setUser({
                id: userId,
                name: userName || "",
                surname: userSurname || "",
                email: userEmail || "",
                role: userRole || "",
                gender: userGender || "male",
            });
        }
    }, []);

    useEffect(() => {
        if (user.id && !coursesLoaded && !coursesLoading) {
            loadUserCourses();
        }
    }, [user.id, coursesLoaded]);

    const loadUserCourses = async () => {
        if (!user.id) return;

        try {
            setCoursesLoading(true);
            setCoursesError(null);

            const response = await axios.get(`http://127.0.0.1:5000/student_courses/${user.id}`);

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
                setCoursesLoaded(true);
            } else {
                setCourses([]);
                setCoursesLoaded(true);
            }
        } catch (err) {
            console.error("Error loading courses:", err);
            setCoursesError("Failed to load courses. Please try again later.");
            setCourses([]);
        } finally {
            setCoursesLoading(false);
        }
    };


    const updateCourse = async (courseId, updatedData) => {
        try {
            await axios.put(`http://127.0.0.1:5000/update_course/${courseId}`, updatedData);

            setCourses(prevCourses =>
                prevCourses.map(course =>
                    course.id === courseId
                        ? { ...course, ...updatedData }
                        : course
                )
            );

            return { success: true };
        } catch (error) {
            console.error("Error updating course:", error);
            return {
                success: false,
                error: error.response?.data?.error || "Failed to update course"
            };
        }
    };

    const getCourse = (courseId) => {
        return courses.find(course => course.id === courseId) || null;
    };

    const updateUser = (userData) => {
        setUser(userData);

        localStorage.setItem("userId", userData.id);
        localStorage.setItem("userName", userData.name);
        localStorage.setItem("userSurname", userData.surname);
        localStorage.setItem("userEmail", userData.email);
        localStorage.setItem("userRole", userData.role);
        localStorage.setItem("userGender", userData.gender);
    };

    const clearUser = () => {
        setUser({
            id: "",
            name: "",
            surname: "",
            email: "",
            role: "",
            gender: "",
        });

        setCourses([]);
        setCoursesLoaded(false);

        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userSurname");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userGender");
        localStorage.removeItem("isLoggedIn");
    };

    const refreshCourses = () => {
        setCoursesLoaded(false);
    };

    const [theme, setTheme] = useState("Light");
    const [language, setLanguage] = useState("English");
    const [notifications, setNotifications] = useState({
        messages: true,
        courseUpdates: false,
        assignments: true,
        announcements: false
    });
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [twoFactor, setTwoFactor] = useState("Disabled");
    const [saveStatus, setSaveStatus] = useState("");
    const [privacySettings, setPrivacySettings] = useState({
        profileVisible: false,
        showOnlineStatus: false,
        allowDataCollection: false,
        dataSharing: "Minimal (Required Only)"
    });

    const handleSave = () => {
        setSaveStatus("Saving...");
        setTimeout(() => {
            setSaveStatus("Settings saved successfully!");
            setTimeout(() => setSaveStatus(""), 3000);
        }, 1000);
    };

    const handleNotificationChange = (type) => {
        setNotifications({
            ...notifications,
            [type]: !notifications[type]
        });
    };

    const terminateSession = (device) => {
        alert(`Session terminated for ${device}`);
    };

    const handlePrivacyChange = (setting, value) => {
        setPrivacySettings({
            ...privacySettings,
            [setting]: typeof value === 'boolean' ? value : value
        });
    };

    return (
        <GlobalContext.Provider value={{
            selectedComponent,
            setSelectedComponent,
            selectedCourseId,
            setSelectedCourseId,
            user,
            updateUser,
            clearUser,
            theme,
            setTheme,
            language,
            setLanguage,
            notifications,
            setNotifications,
            handleNotificationChange,
            newPassword,
            setNewPassword,
            confirmPassword,
            setConfirmPassword,
            twoFactor,
            setTwoFactor,
            saveStatus,
            setSaveStatus,
            handleSave,
            terminateSession,
            privacySettings,
            handlePrivacyChange,
            courses,
            coursesLoading,
            coursesError,
            loadUserCourses,
            updateCourse,
            getCourse,
            refreshCourses
        }}>
            {children}
        </GlobalContext.Provider>
    );
};
