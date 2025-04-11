import axiosInstance from '../utils/axiosConfig';

export const addSection = async (BACKEND_URL, sectionData) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_URL}/add_section`, sectionData);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error("Error adding section:", error);
        return {
            success: false,
            error: error.response?.data?.error || "Failed to add section. Please try again."
        };
    }
};

export const deleteSection = async (BACKEND_URL, sectionId) => {
    try {
        await axiosInstance.delete(`${BACKEND_URL}/delete_section/${sectionId}`);
        return {
            success: true
        };
    } catch (error) {
        console.error("Error deleting section:", error);
        return {
            success: false,
            error: error.response?.data?.error || "Failed to delete section."
        };
    }
};

export const updateSection = async (BACKEND_URL, sectionId, sectionData) => {
    try {
        const response = await axiosInstance.put(`${BACKEND_URL}/update_section/${sectionId}`, sectionData);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error("Error updating section:", error);
        return {
            success: false,
            error: error.response?.data?.error || "Failed to update section."
        };
    }
};

export const uploadFile = async (BACKEND_URL, formData, onProgress) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_URL}/upload_file`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentCompleted);
                }
            }
        });

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error("Error uploading file:", error);
        return {
            success: false,
            error: error.response?.data?.error || "Failed to upload file. Please try again."
        };
    }
};

export const deleteFile = async (BACKEND_URL, fileId) => {
    try {
        await axiosInstance.delete(`${BACKEND_URL}/delete_file/${fileId}`);
        return {
            success: true
        };
    } catch (error) {
        console.error("Error deleting file:", error);
        return {
            success: false,
            error: error.response?.data?.error || "Failed to delete file."
        };
    }
};

export const addQuiz = async (BACKEND_URL, quizData) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_URL}/quiz`, quizData);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error("Error adding quiz:", error);
        return {
            success: false,
            error: error.response?.data?.error || "Failed to add quiz. Please try again."
        };
    }
};

export const deleteLink = async (BACKEND_URL, sectionId, linkId) => {
    try {
        await axiosInstance.delete(`${BACKEND_URL}/delete_link/${sectionId}/${linkId}`);
        return {
            success: true
        };
    } catch (error) {
        console.error("Error deleting link:", error);
        return {
            success: false,
            error: error.response?.data?.error || "Failed to delete link."
        };
    }
};

export const addLink = async (BACKEND_URL, linkData) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_URL}/add_link`, linkData);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error("Error adding link:", error);
        return {
            success: false,
            error: error.response?.data?.error || "Failed to add link. Please try again."
        };
    }
};

export const toggleSectionCompletion = async (BACKEND_URL, userId, sectionId, isCompleted) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_URL}/toggle_section_completion`, {
            user_id: userId,
            section_id: sectionId,
            is_completed: isCompleted
        });

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error("Error toggling section completion:", error);
        return {
            success: false,
            error: error.response?.data?.error || "Failed to update section completion status."
        };
    }
};

export const getCompletedSections = async (BACKEND_URL, userId, courseId) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_URL}/completed_sections/${userId}/${courseId}`);
        return {
            success: true,
            data: response.data.completedSections
        };
    } catch (error) {
        console.error("Error fetching completed sections:", error);
        return {
            success: false,
            error: error.response?.data?.error || "Failed to fetch completed sections."
        };
    }
};
