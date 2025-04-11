import React, { useContext, useEffect } from 'react';
import styles from '../styles/modal.module.css';
import { GlobalContext } from "../context/GlobalContext";

export default function Modal({ isOpen, onClose, title, children, fullWidth = false }) {
    const { backgroundColor, textColor } = useContext(GlobalContext);

    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscKey);

        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div
                className={`${styles.modalContent} ${fullWidth ? styles.fullWidthModal : ''}`}
                onClick={e => e.stopPropagation()}
                style={{
                    backgroundColor: backgroundColor,
                    color: textColor
                }}
            >
                <div
                    className={styles.modalHeader}
                    style={{
                        backgroundColor: backgroundColor,
                        borderBottomColor: textColor === '#ffffff' ? '#444' : '#e2e8f0'
                    }}
                >
                    <h2 className={styles.modalTitle} style={{ color: textColor }}>{title}</h2>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        style={{ color: textColor }}
                    >×</button>
                </div>
                <div className={styles.modalBody}>
                    {React.Children.map(children, child => {
                        if (React.isValidElement(child)) {
                            return React.cloneElement(child, {
                                backgroundColor,
                                textColor
                            });
                        }
                        return child;
                    })}
                </div>
            </div>
        </div>
    );
}
