import {createContext, useEffect, useState} from "react";

export const GlobalContext = createContext(undefined, undefined);

export default function GlobalProvider({ children }) {
    const [selectedComponent, setSelectedComponent] = useState("home");
    const [selectedCourseId, setSelectedCourseId] = useState(null);

    // Add user state to the context
    const [user, setUser] = useState({
        id: "",
        name: "",
        surname: "",
        email: "",
        role: "",
        gender: "",
    });

    // Load user data from localStorage on initial render
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

    // Function to update user data
    const updateUser = (userData) => {
        setUser(userData);

        // Also update localStorage
        localStorage.setItem("userId", userData.id);
        localStorage.setItem("userName", userData.name);
        localStorage.setItem("userSurname", userData.surname);
        localStorage.setItem("userEmail", userData.email);
        localStorage.setItem("userRole", userData.role);
        localStorage.setItem("userGender", userData.gender);
    };

    // Function to clear user data (for logout)
    const clearUser = () => {
        setUser({
            id: "",
            name: "",
            surname: "",
            email: "",
            role: "",
            gender: "",
        });

        // Clear localStorage
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("userSurname");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userGender");
        localStorage.removeItem("isLoggedIn");
    };

    // Settings state
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

    // Common functions
    const handleSave = () => {
        // Simulate saving settings
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
            handlePrivacyChange
        }}>
            {children}
        </GlobalContext.Provider>
    );
};
