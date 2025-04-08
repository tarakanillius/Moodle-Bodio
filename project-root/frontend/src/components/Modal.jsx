import React from 'react';
import styles from '../styles/modal.module.css';

export default function Modal({ isOpen, onClose, title, children, theme = "Light" }) {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div
                className={styles.modalContent}
                onClick={e => e.stopPropagation()}
                style={{
                    backgroundColor: theme === "Dark" ? "#333" : "#fff",
                    color: theme === "Dark" ? "#fff" : "#333"
                }}
            >
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>{title}</h2>
                </div>
                <div className={styles.modalBody}>
                    {children}
                </div>
            </div>
        </div>
    );
}
