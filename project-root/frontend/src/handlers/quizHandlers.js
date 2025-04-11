import axiosInstance from '../utils/axiosConfig';

export const fetchQuiz = async (BACKEND_URL, quizId) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_URL}/quiz/${quizId}`);
        return {
            success: true,
            quiz: response.data.quiz
        };
    } catch (error) {
        console.error("Error fetching quiz:", error);
        return {
            success: false,
            error: error.response?.data?.error || "Failed to load quiz. Please try again later."
        };
    }
};

export const submitQuiz = async (BACKEND_URL, quizId, userId, answers) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_URL}/quiz-submit`, {
            quiz_id: quizId,
            user_id: userId,
            answers: answers
        });

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error("Error submitting quiz:", error);
        return {
            success: false,
            error: error.response?.data?.error || "Failed to submit quiz. Please try again."
        };
    }
};

export const getQuizResults = async (BACKEND_URL, quizId, userId) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_URL}/quiz-results/${quizId}/${userId}`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return {
                success: false,
                error: "No results found"
            };
        }

        console.error("Error fetching quiz results:", error);
        return {
            success: false,
            error: error.response?.data?.error || "Failed to fetch quiz results."
        };
    }
};

export const fetchQuizzesByIds = async (BACKEND_URL, quizIds) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_URL}/quizzes-by-ids`, { quizIds });
        return {
            success: true,
            quizzes: response.data.quizzes
        };
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        return {
            success: false,
            error: error.response?.data?.error || "Failed to load quizzes. Please try again later."
        };
    }
};

export const createQuiz = async (BACKEND_URL, quizData) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_URL}/quiz`, quizData);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error("Error creating quiz:", error);
        return {
            success: false,
            error: error.response?.data?.error || "Failed to create quiz. Please try again."
        };
    }
};

export const updateQuiz = async (BACKEND_URL, quizId, quizData) => {
    try {
        const response = await axiosInstance.put(`${BACKEND_URL}/quiz/${quizId}`, quizData);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error("Error updating quiz:", error);
        return {
            success: false,
            error: error.response?.data?.error || "Failed to update quiz. Please try again."
        };
    }
};

export const deleteQuiz = async (BACKEND_URL, quizId) => {
    try {
        await axiosInstance.delete(`${BACKEND_URL}/quiz/${quizId}`);
        return {
            success: true
        };
    } catch (error) {
        console.error("Error deleting quiz:", error);
        return {
            success: false,
            error: error.response?.data?.error || "Failed to delete quiz."
        };
    }
};
