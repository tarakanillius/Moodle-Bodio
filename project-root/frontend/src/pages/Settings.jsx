import React, { useState } from "react";
import styles from "../styles/settings.module.css";

const Settings = () => {
    const [activeTab, setActiveTab] = useState("general");
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
        // Simulate terminating a session
        alert(`Session terminated for ${device}`);
    };

    return (
        <div className={styles.settingsWrapper}>
            {/* Navigation Tabs */}
            <nav className={styles.settingsNav}>
                <button
                    className={activeTab === "general" ? styles.active : ""}
                    onClick={() => setActiveTab("general")}
                >
                    General
                </button>
                <button
                    className={activeTab === "notifications" ? styles.active : ""}
                    onClick={() => setActiveTab("notifications")}
                >
                    Notifications
                </button>
                <button
                    className={activeTab === "security" ? styles.active : ""}
                    onClick={() => setActiveTab("security")}
                >
                    Security
                </button>
                <button
                    className={activeTab === "privacy" ? styles.active : ""}
                    onClick={() => setActiveTab("privacy")}
                >
                    Privacy
                </button>
            </nav>

            {/* Settings Content */}
            <div className={styles.settingsContent}>
                {/* General Settings */}
                {activeTab === "general" && (
                    <div className={styles.settingsSection}>
                        <h2>General Settings</h2>
                        <div className={styles.settingItem}>
                            <div className={styles.settingItem}>
                                <label>Email Address</label>
                                <input type="email" value="mario.rossi@example.com" disabled/>
                            </div>
                            <div className={styles.settingItem}>
                                <label>Account Info</label>
                                <input type="text" value="Mario Rossi registered 12.01.2024 by Admin123" disabled/>
                            </div>
                            <label>Theme</label>
                            <select
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                            >
                                <option>Light</option>
                                <option>Dark</option>
                                <option>System Default</option>
                            </select>
                        </div>
                        <div className={styles.settingItem}>
                            <label>Language</label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                            >
                                <option>English</option>
                                <option>Italian</option>
                                <option>French</option>
                                <option>German</option>
                            </select>
                        </div>
                        <button className={styles.saveButton} onClick={handleSave}>
                            Save Changes
                        </button>
                        {saveStatus && <p>{saveStatus}</p>}
                    </div>
                )}

                {/* Notification Settings */}
                {activeTab === "notifications" && (
                    <div className={styles.settingsSection}>
                        <h2>Notification Settings</h2>
                        <div className={styles.settingItem}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={notifications.messages}
                                    onChange={() => handleNotificationChange("messages")}
                                />
                                New Messages
                            </label>
                        </div>
                        <div className={styles.settingItem}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={notifications.courseUpdates}
                                    onChange={() => handleNotificationChange("courseUpdates")}
                                />
                                Course Updates
                            </label>
                        </div>
                        <div className={styles.settingItem}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={notifications.assignments}
                                    onChange={() => handleNotificationChange("assignments")}
                                />
                                New Assignment Alerts
                            </label>
                        </div>
                        <div className={styles.settingItem}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={notifications.announcements}
                                    onChange={() => handleNotificationChange("announcements")}
                                />
                                Announcements
                            </label>
                        </div>
                        <div className={styles.settingItem}>
                            <label>Notification Method</label>
                            <select>
                                <option>Email & In-App</option>
                                <option>Email Only</option>
                                <option>In-App Only</option>
                                <option>None</option>
                            </select>
                        </div>
                        <button className={styles.saveButton} onClick={handleSave}>
                            Save Changes
                        </button>
                        {saveStatus && <p>{saveStatus}</p>}
                    </div>
                )}

                {/* Security Settings */}
                {activeTab === "security" && (
                    <div className={styles.settingsSection}>
                        <h2>Security Settings</h2>
                        <div className={styles.settingItem}>
                            <label>New Password</label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className={styles.settingItem}>
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div className={styles.settingItem}>
                            <label>Two-Factor Authentication</label>
                            <select
                                value={twoFactor}
                                onChange={(e) => setTwoFactor(e.target.value)}
                            >
                                <option>Disabled</option>
                                <option>SMS</option>
                                <option>Authenticator App</option>
                                <option>Email</option>
                            </select>
                        </div>
                        <div className={styles.settingItem}>
                            <label>Login History</label>
                            <div className={styles.history}>
                                <ul>
                                    <li>
                                        <span>March 25, 2025 - 12:30 PM</span>
                                        <span>IP: 192.168.0.1</span>
                                    </li>
                                    <li>
                                        <span>March 24, 2025 - 10:00 AM</span>
                                        <span>IP: 192.168.0.2</span>
                                    </li>
                                    <li>
                                        <span>March 22, 2025 - 08:15 AM</span>
                                        <span>IP: 192.168.0.3</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className={styles.settingItem}>
                            <label>Active Sessions</label>
                            <div className={styles.sessions}>
                                <ul>
                                    <li className={styles.sessionItem}>
                                        <span>
                                            MacBook Pro
                                            <span className={`${styles.deviceBadge} ${styles.deviceActive}`}>Active</span>
                                        </span>
                                        <button onClick={() => terminateSession("MacBook Pro")}>
                                            Terminate
                                        </button>
                                    </li>
                                    <li className={styles.sessionItem}>
                                        <span>
                                            iPhone 12
                                            <span className={`${styles.deviceBadge} ${styles.deviceIdle}`}>Idle</span>
                                        </span>
                                        <button onClick={() => terminateSession("iPhone 12")}>
                                            Terminate
                                        </button>
                                    </li>
                                    <li className={styles.sessionItem}>
                                        <span>
                                            iPad Air
                                            <span className={`${styles.deviceBadge} ${styles.deviceIdle}`}>Idle</span>
                                        </span>
                                        <button onClick={() => terminateSession("iPad Air")}>
                                            Terminate
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <button className={styles.saveButton} onClick={handleSave}>
                            Save Changes
                        </button>
                        {saveStatus && <p>{saveStatus}</p>}
                    </div>
                )}

                {/* Privacy Settings */}
                {activeTab === "privacy" && (
                    <div className={styles.settingsSection}>
                        <h2>Privacy Settings</h2>
                        <div className={styles.settingItem}>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" />
                                Allow profile to be visible to other users
                            </label>
                        </div>
                        <div className={styles.settingItem}>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" />
                                Show online status
                            </label>
                        </div>
                        <div className={styles.settingItem}>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" />
                                Allow data collection for service improvement
                            </label>
                        </div>
                        <div className={styles.settingItem}>
                            <label>Data Sharing</label>
                            <select>
                                <option>Minimal (Required Only)</option>
                                <option>Standard</option>
                                <option>Full Access</option>
                            </select>
                        </div>
                        <div className={styles.settingItem}>
                            <label>Download Your Data</label>
                            <button className={styles.saveButton}>Request Data Export</button>
                        </div>
                        <button className={styles.saveButton} onClick={handleSave}>
                            Save Changes
                        </button>
                        {saveStatus && <p>{saveStatus}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
