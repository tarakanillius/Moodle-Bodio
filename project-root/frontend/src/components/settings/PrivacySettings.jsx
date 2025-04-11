import React, { useState, useContext } from 'react';
import { GlobalContext } from '../../context/GlobalContext';
import styles from '../../styles/settings.module.css';

export default function PrivacySettings() {
    const { user, backgroundColor, backgroundColor2, textColor } = useContext(GlobalContext);
    const [formData, setFormData] = useState({
        profileVisibility: user?.privacy?.profileVisibility || 'public',
        showEmail: user?.privacy?.showEmail || false,
        showCourses: user?.privacy?.showCourses || true,
        allowDataCollection: user?.privacy?.allowDataCollection || true
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        setError('');

        setTimeout(() => {
            setSaving(false);
            setMessage('Privacy settings updated successfully!');
        }, 1000);
    };

    return (
        <div className={styles.settingSection} style={{ backgroundColor: backgroundColor2 }}>
            <h2 style={{ color: textColor }}>Privacy Settings</h2>

            <form onSubmit={handleSubmit}>
                <div className={styles.settingGroup} style={{ backgroundColor: backgroundColor2 }}>
                    <h3 style={{ color: textColor }}>Profile Visibility</h3>

                    <div className={styles.settingItem} style={{ backgroundColor: backgroundColor2 }}>
                        <label htmlFor="profileVisibility" style={{ color: textColor }}>Who can see your profile</label>
                        <select
                            id="profileVisibility"
                            name="profileVisibility"
                            value={formData.profileVisibility}
                            onChange={handleChange}
                            style={{ backgroundColor, color: textColor }}
                        >
                            <option value="public">Public - Anyone can view your profile</option>
                            <option value="courses">Courses - Only people in your courses</option>
                            <option value="private">Private - Only you</option>
                        </select>
                    </div>
                </div>

                <div className={styles.settingGroup} style={{ backgroundColor: backgroundColor2 }}>
                    <h3 style={{ color: textColor }}>Information Sharing</h3>

                    <div className={styles.settingItem} style={{ backgroundColor: backgroundColor2 }}>
                        <label className={styles.checkboxLabel} style={{ color: textColor }}>
                            <input
                                type="checkbox"
                                name="showEmail"
                                checked={formData.showEmail}
                                onChange={handleChange}
                            />
                            Show my email address to others
                        </label>
                    </div>

                    <div className={styles.settingItem} style={{ backgroundColor: backgroundColor2 }}>
                        <label className={styles.checkboxLabel} style={{ color: textColor }}>
                            <input
                                type="checkbox"
                                name="showCourses"
                                checked={formData.showCourses}
                                onChange={handleChange}
                            />
                            Show my enrolled courses to others
                        </label>
                    </div>
                </div>

                <div className={styles.settingGroup} style={{ backgroundColor: backgroundColor2 }}>
                    <h3 style={{ color: textColor }}>Data Collection</h3>

                    <div className={styles.settingItem} style={{ backgroundColor: backgroundColor2 }}>
                        <label className={styles.checkboxLabel} style={{ color: textColor }}>
                            <input
                                type="checkbox"
                                name="allowDataCollection"
                                checked={formData.allowDataCollection}
                                onChange={handleChange}
                            />
                            Allow data collection for platform improvement
                        </label>
                    </div>

                    <div className={styles.settingItem} style={{ backgroundColor: backgroundColor2 }}>
                        <p style={{ color: textColor, fontSize: '14px', marginTop: '10px' }}>
                            You can request to delete all your data from our platform.
                        </p>
                        <button
                            type="button"
                            className={styles.dangerButton}
                            onClick={() => alert('This would trigger a data deletion request')}
                        >
                            Request Data Deletion
                        </button>
                    </div>
                </div>

                <div className={styles.buttonContainer}>
                    <button
                        type="submit"
                        className={styles.button}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Privacy Settings'}
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
