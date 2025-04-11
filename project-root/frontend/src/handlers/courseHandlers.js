import axiosInstance from '../utils/axiosConfig';

export const fetchCourses = async (BACKEND_URL) => {
    try {
        const response = await axiosInstance.get(`${BACKEND_URL}/courses`);
        return {
            success: true,
            courses: response.data.courses
        };
    } catch (error) {
        console.error("Error fetching courses:", error);
        return {
            success: false,
            error: "Failed to load courses. Please try again later."
        };
    }
};

export const getCourse = async (backendUrl, courses, courseId, forceDetails = false) => {
    const cachedCourse = courses.find(course => course.id === courseId);

    if (forceDetails && cachedCourse && (!cachedCourse.sections || !cachedCourse.students)) {
        const result = await getCourseById(backendUrl, courseId);
        if (result.success) {
            return result.course;
        }
    }

    return cachedCourse;
};

export const addCourse = async (BACKEND_URL, courseData) => {
    try {
        const response = await axiosInstance.post(`${BACKEND_URL}/add_course`, courseData);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error("Error adding course:", error);
        return {
            success: false,
            error: error.response?.data?.error || "Failed to add course. Please try again."
        };
    }
};

export const deleteCourse = async (BACKEND_URL, courseId) => {
    try {
        await axiosInstance.delete(`${BACKEND_URL}/delete_course/${courseId}`);
        return {
            success: true
        };
    } catch (error) {
        console.error("Error deleting course:", error);
        return {
            success: false,
            error: error.response?.data?.error || "Failed to delete course."
        };
    }
};

export const updateCourse = async (BACKEND_URL, courseId, courseData) => {
    try {
        const response = await axiosInstance.put(`${BACKEND_URL}/update_course/${courseId}`, courseData);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error("Error updating course:", error);
        return {
            success: false,
            error: error.response?.data?.error || "Failed to update course."
        };
    }
};

export const handleUnenrollStudent = async (BACKEND_URL, studentId, courseId) => {
    try {
        await axiosInstance.post(`${BACKEND_URL}/unenroll_student`, {
            student_id: studentId,
            course_id: courseId
        });
        return { success: true };
    } catch (error) {
        console.error("Error unenrolling student:", error);
        return {
            success: false,
            error: error.response?.data?.error || "Failed to unenroll student."
        };
    }
};

export const filterCourses = (courses, searchQuery) => {
    if (!searchQuery || typeof searchQuery !== 'string' || !searchQuery.trim()) {
        return courses;
    }

    const query = searchQuery.toLowerCase();
    return courses.filter(course =>
        course.name.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query)
    );
};

export const getCourseById = async (backendUrl, courseId) => {
    try {
        if (!courseId || !/^[0-9a-fA-F]{24}$/.test(courseId)) {
            return {
                success: false,
                error: 'Invalid course ID format'
            };
        }

        const response = await axiosInstance.get(`${backendUrl}/course/${courseId}`);
        return {
            success: true,
            course: response.data.course
        };
    } catch (error) {
        console.error('Error fetching course:', error);
        return {
            success: false,
            error: error.response?.data?.error || 'Failed to fetch course details'
        };
    }
};
