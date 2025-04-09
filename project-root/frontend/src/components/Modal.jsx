import React, {useContext} from 'react';
import styles from '../styles/modal.module.css';
import {GlobalContext} from "../context/GlobalContext";

export default function Modal({ isOpen, onClose, title, children }) {
    const {backgroundColor, textColor} = useContext(GlobalContext);
    if (!isOpen) return null;


    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div
                className={styles.modalContent}
                onClick={e => e.stopPropagation()}
                style={{
                    backgroundColor: backgroundColor,
                    color: textColor
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
