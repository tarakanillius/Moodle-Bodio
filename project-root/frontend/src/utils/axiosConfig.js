import axios from 'axios';

const axiosInstance = axios.create();

// Add a request interceptor
axiosInstance.interceptors.request.use(
    config => {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        // If token exists, add it to the request headers
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        // If unauthorized and token exists, it might be expired
        if (error.response && error.response.status === 401 && localStorage.getItem('token')) {
            // Clear token and user data
            localStorage.removeItem('token');
            localStorage.removeItem('isLoggedIn');

            // Redirect to login page
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default axios;
