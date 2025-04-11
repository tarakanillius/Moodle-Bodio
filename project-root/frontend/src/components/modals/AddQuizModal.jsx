import React, { useState, useEffect, useContext } from 'react';
import { FaPlus, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import Modal from "../Modal";
import styles from "../../styles/modal.module.css";
import { GlobalContext } from "../../context/GlobalContext";

export default function AddQuizModal({ isOpen, onClose, onSubmit, isSubmitting, initialData = null, isEditing = false }) {
    const { backgroundColor, backgroundColor2, textColor } = useContext(GlobalContext);

    const [quizData, setQuizData] = useState({
        title: '',
        description: '',
        timeLimit: 30,
        questions: []
    });
    const [submitError, setSubmitError] = useState('');
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        if (initialData && isEditing) {
            setQuizData({
                title: initialData.title || '',
                description: initialData.description || '',
                timeLimit: initialData.timeLimit || 30,
                questions: initialData.questions ? initialData.questions.map(q => ({
                    ...q,
                    id: q.id || new Date().getTime().toString() + Math.random().toString(36).substr(2, 9),
                    options: q.options.map(opt => ({
                        ...opt,
                        id: opt.id || `opt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                    }))
                })) : []
            });

            if (initialData.questions && initialData.questions.length > 0) {
                setCurrentStep(2);
            }
        }
    }, [initialData, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setQuizData(prev => ({
            ...prev,
            [name]: name === 'timeLimit' ? parseInt(value) || 30 : value
        }));
    };

    const addQuestion = () => {
        setQuizData(prev => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    id: new Date().getTime().toString() + Math.random().toString(36).substr(2, 9),
                    text: '',
                    type: 'multiple_choice',
                    options: [
                        { id: `opt-${Date.now()}-1`, text: '', isCorrect: false },
                        { id: `opt-${Date.now()}-2`, text: '', isCorrect: false },
                        { id: `opt-${Date.now()}-3`, text: '', isCorrect: false },
                        { id: `opt-${Date.now()}-4`, text: '', isCorrect: false }
                    ],
                    points: 1
                }
            ]
        }));
    };

    const removeQuestion = (index) => {
        setQuizData(prev => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index)
        }));
    };

    const handleQuestionChange = (index, field, value) => {
        setQuizData(prev => ({
            ...prev,
            questions: prev.questions.map((q, i) =>
                i === index ? { ...q, [field]: value } : q
            )
        }));
    };

    const handleOptionChange = (questionIndex, optionIndex, value) => {
        setQuizData(prev => ({
            ...prev,
            questions: prev.questions.map((q, i) =>
                i === questionIndex ? {
                    ...q,
                    options: q.options.map((opt, j) =>
                        j === optionIndex ? { ...opt, text: value } : opt
                    )
                } : q
            )
        }));
    };

    const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
        setQuizData(prev => ({
            ...prev,
            questions: prev.questions.map((q, i) =>
                i === questionIndex ? {
                    ...q,
                    options: q.options.map((opt, j) => ({
                        ...opt,
                        isCorrect: j === optionIndex
                    }))
                } : q
            )
        }));
    };

    const addOption = (questionIndex) => {
        setQuizData(prev => ({
            ...prev,
            questions: prev.questions.map((q, i) =>
                i === questionIndex ? {
                    ...q,
                    options: [
                        ...q.options,
                        { id: `opt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, text: '', isCorrect: false }
                    ]
                } : q
            )
        }));
    };

    const removeOption = (questionIndex, optionIndex) => {
        setQuizData(prev => ({
            ...prev,
            questions: prev.questions.map((q, i) =>
                i === questionIndex ? {
                    ...q,
                    options: q.options.filter((_, j) => j !== optionIndex)
                } : q
            )
        }));
    };

    const moveQuestion = (index, direction) => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === quizData.questions.length - 1)
        ) {
            return;
        }

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        const newQuestions = [...quizData.questions];
        [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];

        setQuizData(prev => ({
            ...prev,
            questions: newQuestions
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (currentStep === 1) {
            if (!quizData.title.trim()) {
                setSubmitError("Please enter a quiz title");
                return;
            }
            setCurrentStep(2);
            setSubmitError('');
            return;
        }

        if (quizData.questions.length === 0) {
            setSubmitError("Please add at least one question");
            return;
        }

        for (const question of quizData.questions) {
            if (!question.text.trim()) {
                setSubmitError("All questions must have text");
                return;
            }

            if (question.options.some(opt => !opt.text.trim())) {
                setSubmitError("All options must have text");
                return;
            }

            if (!question.options.some(opt => opt.isCorrect)) {
                setSubmitError("Each question must have at least one correct answer");
                return;
            }
        }

        const formattedQuizData = {
            ...quizData,
            questions: quizData.questions.map(q => ({
                ...q,
                correctAnswer: q.options.findIndex(opt => opt.isCorrect)
            }))
        };

        try {
            await onSubmit(formattedQuizData);

            if (!isEditing) {
                setQuizData({
                    title: '',
                    description: '',
                    timeLimit: 30,
                    questions: []
                });
                setCurrentStep(1);
            }
            setSubmitError('');
        } catch (error) {
            setSubmitError(error.message || "Failed to add quiz. Please try again.");
        }
    };

    const handleClose = () => {
        if (!isEditing) {
            setQuizData({
                title: '',
                description: '',
                timeLimit: 30,
                questions: []
            });
            setCurrentStep(1);
        }
        setSubmitError('');
        onClose();
    };

    const inputStyle = {
        backgroundColor: backgroundColor2,
        color: textColor,
        borderColor: textColor === '#ffffff' ? '#444' : '#e2e8f0'
    };

    const labelStyle = {
        color: textColor
    };

    const questionCardStyle = {
        backgroundColor: backgroundColor2,
        borderColor: textColor === '#ffffff' ? '#444' : '#e2e8f0',
        color: textColor
    };

    const optionRowStyle = {
        backgroundColor: backgroundColor,
        borderColor: textColor === '#ffffff' ? '#444' : '#e2e8f0'
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={isEditing
                ? (currentStep === 1 ? "Edit Quiz Details" : "Edit Quiz Questions")
                : (currentStep === 1 ? "Add New Quiz" : "Add Quiz Questions")
            }
            fullWidth={true}
        >
            <form onSubmit={handleSubmit} className={styles.quizForm}>
                {currentStep === 1 ? (
                    <div className={styles.quizDetailsStep}>
                        <div className={styles.formGroup}>
                            <label htmlFor="title" style={labelStyle}>Quiz Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={quizData.title}
                                onChange={handleChange}
                                placeholder="Enter quiz title"
                                required
                                className={styles.input}
                                style={inputStyle}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="description" style={labelStyle}>Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={quizData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Enter quiz description (optional)"
                                className={styles.textarea}
                                style={inputStyle}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="timeLimit" style={labelStyle}>Time Limit (minutes)</label>
                            <input
                                type="number"
                                id="timeLimit"
                                name="timeLimit"
                                value={quizData.timeLimit}
                                onChange={handleChange}
                                min="1"
                                required
                                className={styles.input}
                                style={inputStyle}
                            />
                        </div>
                    </div>
                ) : (
                    <div className={styles.questionsStep}>
                        <div className={styles.questionsContainer}>
                            {quizData.questions.length === 0 ? (
                                <div className={styles.noQuestions} style={{ color: textColor }}>
                                    No questions yet. Click "Add Question" to create your first question.
                                </div>
                            ) : (
                                quizData.questions.map((question, qIndex) => (
                                    <div key={question.id} className={styles.questionCard} style={questionCardStyle}>
                                        <div className={styles.questionHeader}>
                                            <h4 style={{ color: textColor }}>Question {qIndex + 1}</h4>
                                            <div className={styles.questionActions}>
                                                <button
                                                    type="button"
                                                    onClick={() => moveQuestion(qIndex, 'up')}
                                                    disabled={qIndex === 0}
                                                    className={styles.actionButton}
                                                    style={{ color: textColor }}
                                                >
                                                    <FaArrowUp />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moveQuestion(qIndex, 'down')}
                                                    disabled={qIndex === quizData.questions.length - 1}
                                                    className={styles.actionButton}
                                                    style={{ color: textColor }}
                                                >
                                                    <FaArrowDown />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeQuestion(qIndex)}
                                                    className={`${styles.actionButton} ${styles.deleteButton}`}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label style={labelStyle}>Question Text</label>
                                            <textarea
                                                value={question.text}
                                                onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                                                placeholder="Enter question text"
                                                rows={2}
                                                className={styles.textarea}
                                                style={inputStyle}
                                            />
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label style={labelStyle}>Points</label>
                                            <input
                                                type="number"
                                                value={question.points}
                                                onChange={(e) => handleQuestionChange(qIndex, 'points', parseInt(e.target.value) || 1)}
                                                min="1"
                                                className={styles.input}
                                                style={inputStyle}
                                            />
                                        </div>

                                        <div className={styles.optionsContainer}>
                                            <label style={labelStyle}>Options (select one as correct)</label>
                                            {question.options.map((option, oIndex) => (
                                                <div key={option.id} className={styles.optionRow} style={optionRowStyle}>
                                                    <input
                                                        type="radio"
                                                        name={`correct-${question.id}`}
                                                        checked={option.isCorrect}
                                                        onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                                                        className={styles.radioInput}
                                                    />
                                                    <input
                                                        type="text"
                                                        value={option.text}
                                                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                        placeholder={`Option ${oIndex + 1}`}
                                                        className={styles.optionInput}
                                                        style={inputStyle}
                                                    />
                                                    {question.options.length > 2 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeOption(qIndex, oIndex)}
                                                            className={`${styles.actionButton} ${styles.deleteButton}`}
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => addOption(qIndex)}
                                                className={styles.addOptionButton}
                                                style={{
                                                    backgroundColor: backgroundColor2,
                                                    color: textColor,
                                                    borderColor: textColor === '#ffffff' ? '#444' : '#e2e8f0'
                                                }}
                                            >
                                                <FaPlus /> Add Option
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={addQuestion}
                            className={styles.addQuestionButton}
                            style={{
                                backgroundColor: backgroundColor2,
                                color: textColor,
                                borderColor: textColor === '#ffffff' ? '#444' : '#e2e8f0'
                            }}
                        >
                            <FaPlus /> Add Question
                        </button>
                    </div>
                )}

                {submitError && (
                    <div className={styles.errorMessage}>{submitError}</div>
                )}

                <div className={styles.modalActions}>
                    <button
                        type="button"
                        onClick={handleClose}
                        className={styles.cancelButton}
                        disabled={isSubmitting}
                        style={{
                            backgroundColor: backgroundColor2,
                            color: textColor
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : currentStep === 1 ? "Next" : (isEditing ? "Save Changes" : "Save Quiz")}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
