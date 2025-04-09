import {createContext, useEffect, useState} from "react";
import axiosInstance from "../utils/axiosConfig";
import axios from "axios";

export const GlobalContext = createContext(undefined);

export default function GlobalProvider({ children }) {
    const [selectedComponent, setSelectedComponent] = useState("home");
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [theme, setTheme] = useState("Light");
    const backgroundColor = theme === "Dark" ? "#1a1a1a" : "#ffffff";
    const backgroundColor2 = theme === "Dark" ? "#393939" : "#f4f4f4";
    const textColor = theme === "Dark" ? "#ffffff" : "#000000";
    const [language, setLanguage] = useState("English");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [twoFactor, setTwoFactor] = useState("Disabled");
    const [saveStatus, setSaveStatus] = useState("");
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const BACKEND_URL = "http://127.0.0.1:5010";
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [notifications, setNotifications] = useState({
        messages: true,
        courseUpdates: false,
        assignments: true,
        announcements: false
    });
    const [privacySettings, setPrivacySettings] = useState({
        profileVisible: false,
        showOnlineStatus: false,
        allowDataCollection: false,
        dataSharing: "Minimal (Required Only)"
    });
    const [user, setUser] = useState({
        id: "",
        name: "",
        surname: "",
        email: "",
        role: "",
        gender: "",
    });

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem('userId');

            if (!userId) {
                setError("User not logged in");
                setLoading(false);
                return;
            }

            const response = await axiosInstance.get(`${BACKEND_URL}/student_courses/${userId}`);

            if (response.data.courses) {
                const coursesWithDetails = await Promise.all(
                    response.data.courses.map(async (course) => {
                        try {
                            const detailsResponse = await axios.get(`${BACKEND_URL}/course/${course.id}`);
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

    const updateUser = (userData, authToken) => {
        setUser(userData);
        localStorage.setItem("userId", userData.id);
        localStorage.setItem("userName", userData.name);
        localStorage.setItem("userSurname", userData.surname);
        localStorage.setItem("userEmail", userData.email);
        localStorage.setItem("userRole", userData.role);
        localStorage.setItem("userGender", userData.gender);

        if (authToken) {
            localStorage.setItem("token", authToken);
            setToken(authToken);
        }
    };

    const refreshCourses = () => {
        setLoading(false);
    };

    const handleUnenrollStudent = async (studentId, courseId) => {
        try {
            const response = await axiosInstance.post(`${BACKEND_URL}/unenroll_student`, {
                student_id: studentId,
                course_id: courseId
            });

            console.log("Unenroll response:", response.data);

            setCourses(prevCourses =>
                prevCourses.map(course => {
                    if (course.id === courseId) {
                        return {
                            ...course,
                            students: course.students.filter(student => student.id !== studentId)
                        };
                    }
                    return course;
                })
            );

            return { success: true };
        } catch (error) {
            console.error("Error unenrolling student:", error);
            console.error("Error details:", error.response?.data);
            return {
                success: false,
                error: error.response?.data?.error || "Failed to unenroll student"
            };
        }
    };

    const updateCourse = async (courseId, updatedData) => {
        try {
            await axiosInstance.put(`${BACKEND_URL}/update_course/${courseId}`, updatedData);
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

    const clearUser = () => {
        setUser({
            id: "",
            name: "",
            surname: "",
            email: "",
            role: "",
            gender: "",
        });
        setToken("");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userSurname");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userGender");
        localStorage.removeItem("isLoggedIn");
    };

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

    const getCourse = (courseId) => {
        return courses.find(course => course.id === courseId) || null;
    };

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
        setTheme(localStorage.getItem("theme"));
    }, []);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    return (
        <GlobalContext.Provider value={{
            BACKEND_URL,
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
            fetchCourses,
            filteredCourses,
            setFilteredCourses,
            loading,
            error,
            getCourse,
            updateCourse,
            refreshCourses,
            handleUnenrollStudent,
            backgroundColor,
            backgroundColor2,
            textColor
        }}>
            {children}
        </GlobalContext.Provider>
    );
};
