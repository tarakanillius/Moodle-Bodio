import express from 'express';
import {
    getCourses,
    formatCourse,
    getCourseById,
    getStudentCourses,
    addCourse,
    updateCourse,
    deleteCourse
} from '../utils/courses_utils.js';
import { checkAuthorization } from '../utils/auth.js';

const router = express.Router();

// Get all courses
router.get('/courses', async (req, res, next) => {
    try {
        const allCourses = await getCourses();

        const formattedCourses = await Promise.all(
            allCourses.map(async course => {
                return await formatCourse(course);
            })
        );

        res.json({ courses: formattedCourses });
    } catch (err) {
        next(err);
    }
});

// Get course by ID
router.get('/course/:id', async (req, res, next) => {
    try {
        const course = await getCourseById(req.params.id);

        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const formattedCourse = await formatCourse(course, true);
        res.json({ course: formattedCourse });
    } catch (err) {
        next(err);
    }
});

// Get courses for a student
router.get('/student_courses/:id', async (req, res, next) => {
    try {
        const courses = await getStudentCourses(req.params.id);

        const formattedCourses = await Promise.all(
            courses.map(async course => {
                return await formatCourse(course);
            })
        );

        res.json({ courses: formattedCourses });
    } catch (err) {
        if (err.status === 404) {
            return res.status(404).json({ error: err.message });
        }
        next(err);
    }
});

// Add new course
router.post('/add_course', checkAuthorization, async (req, res, next) => {
    try {
        const courseData = req.body;

        if (!courseData.name || !courseData.description || !courseData.teacherId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newCourse = await addCourse(courseData);
        const formattedCourse = await formatCourse(newCourse);

        res.status(201).json({
            message: 'Course added successfully',
            course: formattedCourse
        });
    } catch (err) {
        if (err.status === 404) {
            return res.status(404).json({ error: err.message });
        }
        next(err);
    }
});

// Update course
router.put('/update_course/:id', checkAuthorization, async (req, res, next) => {
    try {
        const result = await updateCourse(req.params.id, req.body);
        res.json(result);
    } catch (err) {
        next(err);
    }
});

// Delete course
router.delete('/delete_course/:id', checkAuthorization, async (req, res, next) => {
    try {
        const result = await deleteCourse(req.params.id);
        res.json(result);
    } catch (err) {
        if (err.status === 404) {
            return res.status(404).json({ error: err.message });
        }
        next(err);
    }
});

export { router };
