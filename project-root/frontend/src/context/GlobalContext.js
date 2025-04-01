import { createContext, useState } from "react";

export const GlobalContext = createContext(undefined, undefined);

export default function GlobalProvider({ children }) {
    const [selectedComponent, setSelectedComponent] = useState("home");

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
