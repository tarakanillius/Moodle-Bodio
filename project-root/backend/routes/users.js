import express from 'express';
import {
    getStudents,
    getTeachers,
    getUserById,
    getUserByEmail,
    formatUser,
    updateUser,
    enrollStudent
} from '../utils/user_utils.js';
import { createJSONToken, isValidPassword, checkAuthorization } from '../utils/auth.js';

const router = express.Router();

// Get all students
router.get('/students', async (req, res, next) => {
    try {
        const students = await getStudents();
        const formattedStudents = await Promise.all(
            students.map(student => formatUser(student))
        );
        res.json({ students: formattedStudents });
    } catch (err) {
        next(err);
    }
});

// Get all teachers
router.get('/teachers', async (req, res, next) => {
    try {
        const teachers = await getTeachers();
        const formattedTeachers = await Promise.all(
            teachers.map(teacher => formatUser(teacher))
        );
        res.json({ teachers: formattedTeachers });
    } catch (err) {
        next(err);
    }
});

// Get user by ID
router.get('/user/:id', async (req, res, next) => {
    try {
        const user = await getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const formattedUser = await formatUser(user);
        res.json({ user: formattedUser });
    } catch (err) {
        next(err);
    }
});

// Get user by email
router.get('/user_by_email/:email', async (req, res, next) => {
    try {
        const user = await getUserByEmail(req.params.email);
        const formattedUser = await formatUser(user);
        res.json({ user: formattedUser });
    } catch (err) {
        if (err.status === 404) {
            return res.status(404).json({ error: err.message });
        }
        next(err);
    }
});

// Login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await getUserByEmail(email);

        // Check password
        const isValid = await isValidPassword(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create token
        const token = createJSONToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role
        });

        res.json({
            message: 'Login successful',
            user_id: user._id.toString(),
            name: user.name,
            role: user.role,
            token
        });
    } catch (err) {
        if (err.status === 404) {
            return res.status(404).json({ error: 'User not found' });
        }
        next(err);
    }
});

// Update user
router.put('/update_user/:id', checkAuthorization, async (req, res, next) => {
    try {
        const result = await updateUser(req.params.id, req.body);
        res.json(result);
    } catch (err) {
        next(err);
    }
});

// Enroll student in course
router.post('/enroll_student', checkAuthorization, async (req, res, next) => {
    try {
        const { student_id, course_id } = req.body;

        if (!student_id || !course_id) {
            return res.status(400).json({ error: 'Student ID and Course ID are required' });
        }

        const result = await enrollStudent(student_id, course_id);
        res.json(result);
    } catch (err) {
        if (err.status === 404) {
            return res.status(404).json({ error: err.message });
        }
        next(err);
    }
});

export { router };
