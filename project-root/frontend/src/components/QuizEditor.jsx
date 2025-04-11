import React, { useState, useEffect, useContext } from 'react';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import styles from '../styles/modal.module.css';
import { GlobalContext } from "../context/GlobalContext";
import { fetchQuiz, updateQuiz } from '../handlers/quizHandlers';
import AddQuizModal from './modals/AddQuizModal';

export default function QuizEditor({ quizId, onClose }) {
    const { BACKEND_URL, backgroundColor, backgroundColor2, textColor } = useContext(GlobalContext);
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        const getQuizDetails = async () => {
            try {
                setLoading(true);
                const result = await fetchQuiz(BACKEND_URL, quizId);

                if (result.success) {
                    setQuiz(result.quiz);
                } else {
                    setError(result.error || "Failed to load quiz");
                }
            } catch (err) {
                console.error("Error fetching quiz:", err);
                setError("An error occurred while loading the quiz");
            } finally {
                setLoading(false);
            }
        };

        getQuizDetails();
    }, [BACKEND_URL, quizId]);

    const handleUpdateQuiz = async (updatedQuizData) => {
        setIsSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            const result = await updateQuiz(BACKEND_URL, quizId, updatedQuizData);

            if (result.success) {
                setQuiz(result.quiz);
                setIsEditing(false);
                setSaveSuccess(true);

                setTimeout(() => {
                    setSaveSuccess(false);
                }, 3000);

                return true;
            } else {
                setSaveError(result.error || "Failed to update quiz");
                return false;
            }
        } catch (error) {
            console.error("Error updating quiz:", error);
            setSaveError(error.message || "An error occurred while updating the quiz");
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.quizEditorContainer} style={{ backgroundColor, color: textColor }}>
                <div className={styles.loadingMessage} style={{ color: textColor }}>
                    Loading quiz...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.quizEditorContainer} style={{ backgroundColor, color: textColor }}>
                <div className={styles.errorMessage}>
                    {error}
                </div>
                <button
                    className={styles.backButton}
                    onClick={onClose}
                    style={{ color: textColor }}
                >
                    <FaArrowLeft /> Back
                </button>
            </div>
        );
    }

    if (isEditing) {
        return (
            <AddQuizModal
                isOpen={true}
                onClose={() => setIsEditing(false)}
                onSubmit={handleUpdateQuiz}
                isSubmitting={isSaving}
                initialData={quiz}
                isEditing={true}
            />
        );
    }

    return (
        <div className={styles.quizEditorContainer} style={{ backgroundColor, color: textColor }}>
            <div className={styles.quizEditorHeader} style={{ borderBottomColor: textColor === '#ffffff' ? '#444' : '#e2e8f0', backgroundColor }}>
                <button
                    className={styles.backButton}
                    onClick={onClose}
                    style={{ color: textColor }}
                >
                    <FaArrowLeft /> Back
                </button>
                <h2 style={{ color: textColor }}>Quiz Editor</h2>
                <button
                    className={styles.editButton}
                    onClick={() => setIsEditing(true)}
                    style={{ color: textColor }}
                >
                    <FaEdit /> Edit Quiz
                </button>
            </div>

            {saveSuccess && (
                <div className={styles.successMessage}>
                    Quiz updated successfully!
                </div>
            )}

            {saveError && (
                <div className={styles.errorMessage}>
                    {saveError}
                </div>
            )}

            <div className={styles.quizDetails} style={{ backgroundColor: backgroundColor2 }}>
                <h3 style={{ color: textColor }}>{quiz.title}</h3>
                {quiz.description && (
                    <p style={{ color: textColor }}>{quiz.description}</p>
                )}
                <div className={styles.quizMeta} style={{ color: textColor }}>
                    <span>Time Limit: {quiz.timeLimit} minutes</span>
                    <span>Questions: {quiz.questions ? quiz.questions.length : 0}</span>
                </div>
            </div>

            <div className={styles.questionsPreview}>
                <h3 style={{ color: textColor }}>Questions</h3>

                {quiz.questions && quiz.questions.length > 0 ? (
                    <div className={styles.questionsList}>
                        {quiz.questions.map((question, index) => (
                            <div
                                key={question.id || index}
                                className={styles.questionItem}
                                style={{
                                    backgroundColor: backgroundColor2,
                                    borderColor: textColor === '#ffffff' ? '#444' : '#e2e8f0'
                                }}
                            >
                                <div className={styles.questionHeader}>
                                    <h4 style={{ color: textColor }}>Question {index + 1}</h4>
                                    <span style={{ color: textColor }}>{question.points} {question.points === 1 ? 'point' : 'points'}</span>
                                </div>
                                <p style={{ color: textColor }}>{question.text}</p>

                                <div className={styles.optionsList}>
                                    {question.options && question.options.map((option, optIndex) => (
                                        <div
                                            key={option.id || optIndex}
                                            className={`${styles.optionItem} ${option.isCorrect ? styles.correctOption : ''}`}
                                            style={{
                                                backgroundColor: option.isCorrect ? 'rgba(72, 187, 120, 0.2)' : backgroundColor,
                                                borderColor: textColor === '#ffffff' ? '#444' : '#e2e8f0',
                                                color: textColor
                                            }}
                                        >
                                            {option.text}
                                            {option.isCorrect && (
                                                <span className={styles.correctBadge}>Correct</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.noQuestions} style={{ color: textColor }}>
                        No questions found for this quiz. Click "Edit Quiz" to add questions.
                    </div>
                )}
            </div>
        </div>
    );
}
