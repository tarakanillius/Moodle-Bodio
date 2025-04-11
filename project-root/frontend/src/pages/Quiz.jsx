import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { fetchQuiz, submitQuiz, getQuizResults } from '../handlers/quizHandlers';
import { FaArrowLeft, FaClock, FaCheck } from 'react-icons/fa';
import styles from '../styles/modal.module.css';

export default function Quiz({ quizId, onBack, inModal = false }) {
    const {
        user,
        BACKEND_URL,
        backgroundColor,
        textColor,
        backgroundColor2
    } = useContext(GlobalContext);

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [score, setScore] = useState(null);
    const [previousResults, setPreviousResults] = useState(null);

    useEffect(() => {
        const loadQuiz = async () => {
            try {
                setLoading(true);

                if (user) {
                    const resultsResponse = await getQuizResults(BACKEND_URL, quizId, user.id);
                    if (resultsResponse.success) {
                        setPreviousResults(resultsResponse.data);
                    }
                }

                const quizResponse = await fetchQuiz(BACKEND_URL, quizId);
                if (quizResponse.success) {
                    setQuiz(quizResponse.quiz);
                    setTimeLeft(quizResponse.quiz.timeLimit * 60);
                } else {
                    setError(quizResponse.error);
                }
            } catch (err) {
                console.error("Error loading quiz:", err);
                setError("Failed to load quiz. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (quizId) {
            loadQuiz();
        }
    }, [quizId, BACKEND_URL, user]);

    useEffect(() => {
        if (!quiz || quizSubmitted || previousResults) return;

        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    handleSubmitQuiz();
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quiz, quizSubmitted, previousResults]);

    const handleAnswerSelect = (questionIndex, answerIndex) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: answerIndex
        }));
    };

    const handleSubmitQuiz = async () => {
        if (quizSubmitted || !user) return;

        try {
            let correctAnswers = 0;
            let totalPoints = 0;

            quiz.questions.forEach((question, index) => {
                const points = question.points || 1;
                totalPoints += points;
                if (answers[index] === question.correctAnswer) {
                    correctAnswers += points;
                }
            });

            const scorePercentage = Math.round((correctAnswers / totalPoints) * 100);

            setScore({
                correct: correctAnswers,
                total: totalPoints,
                percentage: scorePercentage
            });

            const result = await submitQuiz(BACKEND_URL, quizId, user.id, answers);

            if (!result.success) {
                setError(result.error);
            }

            setQuizSubmitted(true);
        } catch (err) {
            console.error("Error submitting quiz:", err);
            setError("Failed to submit quiz. Please try again.");
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const containerStyle = inModal
        ? {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            padding: '0',
            maxWidth: '100%',
            overflow: 'hidden'
        }
        : { backgroundColor, color: textColor };

    if (loading) {
        return (
            <div className={styles.quizContainer} style={containerStyle}>
                <div className={styles.loading}>Loading quiz...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.quizContainer} style={containerStyle}>
                <button className={styles.backButton} onClick={onBack} style={{ color: textColor }}>
                    <FaArrowLeft /> Back to Course
                </button>
                <div className={styles.error}>{error}</div>
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className={styles.quizContainer} style={containerStyle}>
                <button className={styles.backButton} onClick={onBack} style={{ color: textColor }}>
                    <FaArrowLeft /> Back to Course
                </button>
                <div className={styles.error}>Quiz not found</div>
            </div>
        );
    }

    if (previousResults) {
        return (
            <div className={styles.quizContainer} style={containerStyle}>
                <button className={styles.backButton} onClick={onBack} style={{ color: textColor }}>
                    <FaArrowLeft /> Back to Course
                </button>
                <div className={styles.resultsContainer}>
                    <h2 className={styles.resultsTitle}>Previous Quiz Results</h2>
                    <div className={styles.scoreCard}>
                        <div
                            className={styles.scoreCircle}
                            style={{
                                borderColor: previousResults.score >= 70 ? '#48bb78' : previousResults.score >= 50 ? '#ed8936' : '#e53e3e',
                                color: previousResults.score >= 70 ? '#48bb78' : previousResults.score >= 50 ? '#ed8936' : '#e53e3e'
                            }}
                        >
                            <span className={styles.scorePercentage}>{previousResults.score}%</span>
                        </div>
                        <div className={styles.scoreDetails}>
                            <p>You completed this quiz on {new Date(previousResults.completedAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (quizSubmitted) {
        return (
            <div className={styles.quizContainer} style={containerStyle}>
                <button className={styles.backButton} onClick={onBack} style={{ color: textColor }}>
                    <FaArrowLeft /> Back to Course
                </button>
                <div className={styles.resultsContainer}>
                    <h2 className={styles.resultsTitle}>Quiz Results</h2>
                    <div className={styles.scoreCard}>
                        <div
                            className={styles.scoreCircle}
                            style={{
                                borderColor: score.percentage >= 70 ? '#48bb78' : score.percentage >= 50 ? '#ed8936' : '#e53e3e',
                                color: score.percentage >= 70 ? '#48bb78' : score.percentage >= 50 ? '#ed8936' : '#e53e3e'
                            }}
                        >
                            <span className={styles.scorePercentage}>{score.percentage}%</span>
                        </div>
                        <div className={styles.scoreDetails}>
                            <p>You scored {score.correct} out of {score.total} points.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestionData = quiz.questions[currentQuestion];

    return (
        <div className={styles.quizContainer} style={containerStyle}>
            <div className={styles.quizHeader}>
                <button className={styles.backButton} onClick={onBack} style={{ color: textColor }}>
                    <FaArrowLeft /> Back to Course
                </button>
                <h2 className={styles.quizTitle}>{quiz.title}</h2>
                <div className={styles.quizTimer}>
                    <FaClock /> {formatTime(timeLeft)}
                </div>
            </div>

            <div className={styles.progressContainer}>
                <div className={styles.progressText}>
                    Question {currentQuestion + 1} of {quiz.questions.length}
                </div>
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{
                            width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
                            backgroundColor: backgroundColor2
                        }}
                    ></div>
                </div>
            </div>

            {currentQuestionData && (
                <div className={styles.questionContainer} style={{ backgroundColor: backgroundColor2 }}>
                    <h3 className={styles.questionText}>{currentQuestionData.text}</h3>
                    <div className={styles.pointsIndicator}>Points: {currentQuestionData.points || 1}</div>

                    <div className={styles.optionsContainer}>
                        {currentQuestionData.options.map((option, index) => {
                            const optionText = typeof option === 'object' ? option.text : option;

                            return (
                                <div
                                    key={index}
                                    className={`${styles.optionItem} ${answers[currentQuestion] === index ? styles.selectedOption : ''}`}
                                    onClick={() => handleAnswerSelect(currentQuestion, index)}
                                    style={{
                                        borderColor: answers[currentQuestion] === index ? '#4a90e2' : '#ddd',
                                        color: textColor
                                    }}
                                >
                                    <div className={styles.optionCheckbox}>
                                        {answers[currentQuestion] === index && <FaCheck />}
                                    </div>
                                    <div className={styles.optionText}>{optionText}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className={styles.navigationButtons}>
                {currentQuestion > 0 && (
                    <button
                        className={styles.navButton}
                        onClick={() => setCurrentQuestion(prev => prev - 1)}
                        style={{ backgroundColor: backgroundColor2, color: textColor }}
                    >
                        Previous
                    </button>
                )}

                {currentQuestion < quiz.questions.length - 1 ? (
                    <button
                        className={styles.navButton}
                        onClick={() => setCurrentQuestion(prev => prev + 1)}
                        disabled={answers[currentQuestion] === undefined}
                        style={{
                            backgroundColor: backgroundColor2,
                            color: textColor,
                            opacity: answers[currentQuestion] === undefined ? 0.5 : 1
                        }}
                    >
                        Next
                    </button>
                ) : (
                    <button
                        className={styles.submitButton}
                        onClick={handleSubmitQuiz}
                        disabled={Object.keys(answers).length < quiz.questions.length}
                        style={{
                            opacity: Object.keys(answers).length < quiz.questions.length ? 0.5 : 1
                        }}
                    >
                        Submit Quiz
                    </button>
                )}
            </div>
        </div>
    );
}
