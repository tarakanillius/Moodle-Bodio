import React, { useState } from "react";
import "../styles/settings.css";

const Settings = () => {
    const [activeTab, setActiveTab] = useState("general");

    return (
        <div className="settings-wrapper">
            <nav className="settings-nav">
                <button
                    className={activeTab === "general" ? "active" : ""}
                    onClick={() => setActiveTab("general")}
                >
                    General
                </button>
                <button
                    className={activeTab === "notifications" ? "active" : ""}
                    onClick={() => setActiveTab("notifications")}
                >
                    Notifications
                </button>
                <button
                    className={activeTab === "security" ? "active" : ""}
                    onClick={() => setActiveTab("security")}
                >
                    Security
                </button>
            </nav>

            <div className="settings-content">
                {activeTab === "general" && (
                    <div className="settings-section">
                        <h2>General Settings</h2>
                        <label>
                            Username: <input type="text" placeholder="Enter your username" />
                        </label>
                        <label>
                            Email: <input type="email" placeholder="Enter your email" />
                        </label>
                    </div>
                )}

                {activeTab === "notifications" && (
                    <div className="settings-section">
                        <h2>Notification Settings</h2>
                        <label>
                            <input type="checkbox" /> Receive Email Notifications
                        </label>
                        <label>
                            <input type="checkbox" /> Receive Push Notifications
                        </label>
                    </div>
                )}

                {activeTab === "security" && (
                    <div className="settings-section">
                        <h2>Security Settings</h2>
                        <label>
                            Change Password: <input type="password" placeholder="New password" />
                        </label>
                        <label>
                            Two-Factor Authentication:
                            <select>
                                <option>Disabled</option>
                                <option>Enabled</option>
                            </select>
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
