import React from 'react';
import Modal from "../Modal";
import Quiz from "../../pages/Quiz";
import styles from "../../styles/modal.module.css";

export default function QuizTakerModal({ isOpen, onClose, quizId }) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Take Quiz"
        >
            <div className={styles.modalBody}>
                <Quiz quizId={quizId} onBack={onClose} />
            </div>
        </Modal>
    );
}
