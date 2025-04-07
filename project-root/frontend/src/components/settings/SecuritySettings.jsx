import React, {useContext} from "react";
import {GlobalContext} from "../../context/GlobalContext";
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
        terminateSession,
        theme
    } = useContext(GlobalContext);

    return (<div className={styles.settingsSection}>
        <h2 style={{ color: theme === "Dark" ? "#ffffff" : "#000000" }}>Impostazioni di sicurezza</h2>
        <div className={styles.settingItem}>
            <label style={{ color: theme === "Dark" ? "#ffffff" : "#000000" }}>Nuova password</label>
            <input
                type="password"
                placeholder="Inserisci la nuova password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
        </div>
        <div className={styles.settingItem}>
            <label style={{ color: theme === "Dark" ? "#ffffff" : "#000000" }}>Conferma la Password</label>
            <input
                type="password"
                placeholder="Conferma la password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
        </div>
        <div className={styles.settingItem}>
            <label style={{ color: theme === "Dark" ? "#ffffff" : "#000000" }}>Doppio fattore di autenticazione</label>
            <select
                value={twoFactor}
                onChange={(e) => setTwoFactor(e.target.value)}
            >
                <option>Non attivo</option>
                <option>SMS</option>
                <option>Authenticator App</option>
                <option>Email</option>
            </select>
        </div>
        <div className={styles.settingItem}>
            <label style={{ color: theme === "Dark" ? "#ffffff" : "#000000" }}>Storico Login</label>
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
            <label style={{ color: theme === "Dark" ? "#ffffff" : "#000000" }}>Sessioni attive</label>
            <div className={styles.sessions}>
                <ul>
                    <li className={styles.sessionItem}>
              <span>
                  MacBook Pro
                  <span className={`${styles.deviceBadge} ${styles.deviceActive}`}>
                      Attiva
                  </span>
              </span>
                        <button onClick={() => terminateSession("MacBook Pro")}>
                            Disattiva
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
                            Disattiva
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
    </div>);
};

export default SecuritySettings;
