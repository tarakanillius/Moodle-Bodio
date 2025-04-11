import axios from 'axios';
import axiosInstance from '../utils/axiosConfig';

export const login = async (BACKEND_URL, email, password) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/login`, { email, password });

        if (response.data.token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        }

        return {
            success: true,
            token: response.data.token,
            user: {
                id: response.data.user_id,
                name: response.data.name,
                role: response.data.role,
                sex: response.data.sex
            }
        };
    } catch (error) {
        console.error("Login error:", error);
        return {
            success: false,
            error: error.response?.data?.error || "Login failed. Please check your credentials."
        };
    }
};

export const getUserDetails = async (BACKEND_URL, userId) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_URL}/user/${userId}`);
        return {
            success: true,
            user: response.data.user
        };
    } catch (error) {
        console.error("Error fetching user data:", error);
        return {
            success: false,
            error: "Failed to load user data. Please try again later."
        };
    }
};

export const updateUserProfile = async (BACKEND_URL, userId, userData) => {
    try {
        const response = await axiosInstance.put(`${BACKEND_URL}/update_user/${userId}`, userData);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error("Error updating user data:", error);
        return {
            success: false,
            error: "Failed to update profile. Please try again."
        };
    }
};

export const verifyToken = async (BACKEND_URL) => {
    try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            return {
                success: false,
                error: "No user ID found"
            };
        }

        const response = await axiosInstance.get(`${BACKEND_URL}/user/${userId}`);
        return {
            success: true,
            user: {
                id: userId,
                ...response.data.user
            }
        };
    } catch (error) {
        console.error("Token verification error:", error);
        return {
            success: false,
            error: "Token verification failed."
        };
    }
};

export const updateUserInContext = (userData, token = null) => {
    if (token) {
        localStorage.setItem('token', token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    if (userData && userData.id) {
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('isLoggedIn', 'true');
    }

    return userData;
};

export const clearUserFromContext = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('isLoggedIn');
    delete axiosInstance.defaults.headers.common['Authorization'];
};
