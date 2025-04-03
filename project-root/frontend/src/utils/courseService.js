import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

/**
 * Fetches courses for a specific user
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} - Array of course objects
 */
export const fetchUserCourses = async (userId) => {
    try {
        if (userId) {
            const response = await axios.get(`${API_BASE_URL}/student_courses/${userId}`);
            if (!response.data.courses) {
                return [];
            }
            return await Promise.all(
                response.data.courses.map(async (course) => {
                    try {
                        const detailsResponse = await axios.get(`${API_BASE_URL}/course/${course.id}`);
                        return detailsResponse.data.course;
                    } catch (err) {
                        console.error(`Error fetching details for course ${course.id}:`, err);
                        return course;
                    }
                })
            );
        } else {
            throw new Error("User not logged in");
        }
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
};
