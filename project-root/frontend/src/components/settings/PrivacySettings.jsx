import React, { useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import styles from "../../styles/settings.module.css";

const PrivacySettings = () => {
    const {privacySettings, handlePrivacyChange, saveStatus, handleSave} = useContext(GlobalContext);

    return (
        <div className={styles.settingsSection}>
            <h2>Privacy Settings</h2>
            <div className={styles.settingItem}>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={privacySettings.profileVisible}
                        onChange={(e) => handlePrivacyChange("profileVisible", e.target.checked)}
                    />
                    Allow profile to be visible to other users
                </label>
            </div>
            <div className={styles.settingItem}>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={privacySettings.showOnlineStatus}
                        onChange={(e) => handlePrivacyChange("showOnlineStatus", e.target.checked)}
                    />
                    Show online status
                </label>
            </div>
            <div className={styles.settingItem}>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={privacySettings.allowDataCollection}
                        onChange={(e) => handlePrivacyChange("allowDataCollection", e.target.checked)}
                    />
                    Allow data collection for service improvement
                </label>
            </div>
            <div className={styles.settingItem}>
                <label>Data Sharing</label>
                <select
                    value={privacySettings.dataSharing}
                    onChange={(e) => handlePrivacyChange("dataSharing", e.target.value)}
                >
                    <option>Minimal (Required Only)</option>
                    <option>Standard</option>
                    <option>Full Access</option>
                </select>
            </div>
            <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={handleSave}>
                    Salvare
                </button>
                <button className={styles.button}>
                    Request Data Export
                </button>
            </div>
            {saveStatus && <p>{saveStatus}</p>}
        </div>
    );
};

export default PrivacySettings;
