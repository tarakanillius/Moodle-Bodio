import React, { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import styles from "../../styles/settings.module.css";

const SecuritySettings = () => {
    const {
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        twoFactor,
        setTwoFactor,
        saveStatus,
        handleSave,
        terminateSession
    } = useContext(GlobalContext);

    return (
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
                <span className={`${styles.deviceBadge} ${styles.deviceActive}`}>
                  Active
                </span>
              </span>
                            <button onClick={() => terminateSession("MacBook Pro")}>
                                Terminate
                            </button>
                        </li>
                        <li className={styles.sessionItem}>
              <span>
                iPhone 12
                <span className={`${styles.deviceBadge} ${styles.deviceIdle}`}>
                  Idle
                </span>
              </span>
                            <button onClick={() => terminateSession("iPhone 12")}>
                                Terminate
                            </button>
                        </li>
                        <li className={styles.sessionItem}>
              <span>
                iPad Air
                <span className={`${styles.deviceBadge} ${styles.deviceIdle}`}>
                  Idle
                </span>
              </span>
                            <button onClick={() => terminateSession("iPad Air")}>
                                Terminate
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={handleSave}>
                    Salvare
                </button>
            </div>
            {saveStatus && <p>{saveStatus}</p>}
        </div>
    );
};

export default SecuritySettings;
