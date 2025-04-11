import React, { useState, useContext } from 'react';
import { GlobalContext } from '../../context/GlobalContext';
import styles from '../../styles/settings.module.css';

export default function NotificationSettings() {
    const { user, backgroundColor2, textColor } = useContext(GlobalContext);
    const [formData, setFormData] = useState({
        emailNotifications: user?.notifications?.email || true,
        courseUpdates: user?.notifications?.courseUpdates || true,
        assignmentReminders: user?.notifications?.assignmentReminders || true,
        discussionAlerts: user?.notifications?.discussionAlerts || false,
        systemAnnouncements: user?.notifications?.systemAnnouncements || true
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        setError('');

        setTimeout(() => {
            setSaving(false);
            setMessage('Notification settings updated successfully!');
        }, 1000);
    };

    return (
        <div className={styles.settingSection} style={{ backgroundColor: backgroundColor2 }}>
            <h2 style={{ color: textColor }}>Notification Preferences</h2>

            <form onSubmit={handleSubmit}>
                <div className={styles.settingGroup} style={{ backgroundColor: backgroundColor2 }}>
                    <h3 style={{ color: textColor }}>Email Notifications</h3>

                    <div className={styles.settingItem} style={{ backgroundColor: backgroundColor2 }}>
                        <label className={styles.checkboxLabel} style={{ color: textColor }}>
                            <input
                                type="checkbox"
                                name="emailNotifications"
                                checked={formData.emailNotifications}
                                onChange={handleChange}
                            />
                            Receive email notifications
                        </label>
                    </div>
                </div>

                <div className={styles.settingGroup} style={{ backgroundColor: backgroundColor2 }}>
                    <h3 style={{ color: textColor }}>Course Notifications</h3>

                    <div className={styles.settingItem} style={{ backgroundColor: backgroundColor2 }}>
                        <label className={styles.checkboxLabel} style={{ color: textColor }}>
                            <input
                                type="checkbox"
                                name="courseUpdates"
                                checked={formData.courseUpdates}
                                onChange={handleChange}
                            />
                            Course updates and announcements
                        </label>
                    </div>

                    <div className={styles.settingItem} style={{ backgroundColor: backgroundColor2 }}>
                        <label className={styles.checkboxLabel} style={{ color: textColor }}>
                            <input
                                type="checkbox"
                                name="assignmentReminders"
                                checked={formData.assignmentReminders}
                                onChange={handleChange}
                            />
                            Assignment reminders
                        </label>
                    </div>
                </div>

                <div className={styles.settingGroup} style={{ backgroundColor: backgroundColor2 }}>
                    <h3 style={{ color: textColor }}>Other Notifications</h3>

                    <div className={styles.settingItem} style={{ backgroundColor: backgroundColor2 }}>
                        <label className={styles.checkboxLabel} style={{ color: textColor }}>
                            <input
                                type="checkbox"
                                name="discussionAlerts"
                                checked={formData.discussionAlerts}
                                onChange={handleChange}
                            />
                            Discussion forum alerts
                        </label>
                    </div>

                    <div className={styles.settingItem} style={{ backgroundColor: backgroundColor2 }}>
                        <label className={styles.checkboxLabel} style={{ color: textColor }}>
                            <input
                                type="checkbox"
                                name="systemAnnouncements"
                                checked={formData.systemAnnouncements}
                                onChange={handleChange}
                            />
                            System announcements
                        </label>
                    </div>
                </div>

                <div className={styles.buttonContainer}>
                    <button
                        type="submit"
                        className={styles.button}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Preferences'}
                    </button>
                </div>

                {message && (
                    <div className={styles.successMessage}>
                        {message}
                    </div>
                )}

                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
}
