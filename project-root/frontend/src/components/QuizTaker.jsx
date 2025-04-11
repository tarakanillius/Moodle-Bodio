import React, { useContext } from 'react';
import Quiz from '../pages/Quiz';
import styles from '../styles/modal.module.css';
import { GlobalContext } from "../context/GlobalContext";

export default function QuizTaker({ quizId, onClose }) {
    const { backgroundColor, textColor } = useContext(GlobalContext);

    return (
        <div
            className={styles.quizTakerContainer}
            style={{ backgroundColor, color: textColor }}
        >
            <div className={styles.quizTakerHeader} style={{ borderBottomColor: textColor === '#ffffff' ? '#444' : '#e2e8f0' }}>
                <h2 style={{ color: textColor }}>Take Quiz</h2>
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    style={{ color: textColor }}
                >×</button>
            </div>
            <div className={styles.quizTakerContent}>
                <Quiz quizId={quizId} onBack={onClose} inModal={true} />
            </div>
        </div>
    );
}
