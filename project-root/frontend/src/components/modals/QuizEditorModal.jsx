import React from 'react';
import Modal from "../Modal";
import QuizEditor from "../QuizEditor";
import styles from "../../styles/quizEditor.module.css";

export default function QuizEditorModal({ isOpen, onClose, quizId }) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Quiz"
            fullWidth={true}
        >
            <div className={styles.quizEditorWrapper}>
                <QuizEditor quizId={quizId} onClose={onClose} inModal={true} />
            </div>
        </Modal>
    );
}
