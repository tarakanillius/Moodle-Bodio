import React, { useState, useContext } from 'react';
import { GlobalContext } from '../../context/GlobalContext';
import styles from '../../styles/settings.module.css';

export default function SecuritySettings() {
    const { backgroundColor, backgroundColor2, textColor } = useContext(GlobalContext);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.currentPassword) {
            setError('Current password is required');
            return false;
        }

        if (!formData.newPassword) {
            setError('New password is required');
            return false;
        }

        if (formData.newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSaving(true);
        setMessage('');
        setError('');

        setTimeout(() => {
            setSaving(false);
            setMessage('Password changed successfully!');
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }, 1000);
    };

    const toggleTwoFactor = () => {
        setTwoFactorEnabled(!twoFactorEnabled);
        setTimeout(() => {
            setMessage(`Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'} successfully!`);
        }, 500);
    };

    return (
        <div className={styles.settingSection} style={{ backgroundColor: backgroundColor2 }}>
            <h2 style={{ color: textColor }}>Security Settings</h2>

            <div className={styles.settingGroup} style={{ backgroundColor: backgroundColor2 }}>
                <h3 style={{ color: textColor }}>Change Password</h3>

                <form onSubmit={handleSubmit}>
                    <div className={styles.settingItem} style={{ backgroundColor: backgroundColor2 }}>
                        <label htmlFor="currentPassword" style={{ color: textColor }}>Current Password</label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            style={{ backgroundColor, color: textColor }}
                        />
                    </div>

                    <div className={styles.settingItem} style={{ backgroundColor: backgroundColor2 }}>
                        <label htmlFor="newPassword" style={{ color: textColor }}>New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            style={{ backgroundColor, color: textColor }}
                        />
                        <small style={{ color: textColor, display: 'block', marginTop: '5px' }}>Password must be at least 8 characters long</small>
                    </div>

                    <div className={styles.settingItem} style={{ backgroundColor: backgroundColor2 }}>
                        <label htmlFor="confirmPassword" style={{ color: textColor }}>Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            style={{ backgroundColor, color: textColor }}
                        />
                    </div>

                    <div className={styles.buttonContainer} style={{ backgroundColor: backgroundColor2 }}>
                        <button
                            type="submit"
                            className={styles.button}
                            disabled={saving}
                        >
                            {saving ? 'Changing Password...' : 'Change Password'}
                        </button>
                    </div>
                </form>
            </div>

            <div className={styles.settingGroup} style={{ backgroundColor: backgroundColor2 }}>
                <h3 style={{ color: textColor }}>Two-Factor Authentication</h3>

                <div className={styles.settingItem} style={{ backgroundColor: backgroundColor2 }}>
                    <p style={{ color: textColor }}>
                        Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to sign in.
                    </p>

                    <div style={{ marginTop: '15px' }}>
                        <button
                            type="button"
                            className={twoFactorEnabled ? styles.dangerButton : styles.button}
                            onClick={toggleTwoFactor}
                        >
                            {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.settingGroup} style={{ backgroundColor: backgroundColor2 }}>
                <h3 style={{ color: textColor }}>Active Sessions</h3>

                <div className={styles.sessions} style={{ backgroundColor: backgroundColor2 }}>
                    <ul>
                        <li>
                            <div className={styles.sessionItem}>
                                <span style={{color: textColor}}>
                                    Chrome on Windows
                                    <span className={`${styles.deviceBadge} ${styles.deviceActive}`}>Current</span>
                                </span>
                                <span style={{ color: textColor }}>Last active: Just now</span>
                                <button>Sign Out</button>
                            </div>
                        </li>
                        <li>
                            <div className={styles.sessionItem}>
                                <span style={{ color: textColor }}>
                                    Safari on macOS
                                    <span className={`${styles.deviceBadge} ${styles.deviceIdle}`}>Idle</span>
                                </span>
                                <span style={{ color: textColor }}>Last active: 2 days ago</span>
                                <button>Sign Out</button>
                            </div>
                        </li>
                    </ul>
                </div>
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
        </div>
    );
}
