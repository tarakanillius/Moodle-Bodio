import express from 'express';
import {
    getSections,
    getSectionById,
    addSection
} from '../utils/section_utils.js';
import { checkAuthorization } from '../utils/auth.js';

const router = express.Router();

router.get('/sections', checkAuthorization, async (req, res, next) => {
    try {
        const allSections = await getSections();

        const formattedSections = allSections.map(section => ({
            id: section._id.toString(),
            name: section.name,
            data: section.data,
            quizzes: section.quizzes || []
        }));

        res.json({ sections: formattedSections });
    } catch (err) {
        next(err);
    }
});

router.get('/section/:id', checkAuthorization, async (req, res, next) => {
    try {
        const section = await getSectionById(req.params.id);

        if (!section) {
            return res.status(404).json({ error: 'Section not found' });
        }

        const formattedQuizzes = section.quizzes ? section.quizzes.map(quiz => {
            if (typeof quiz === 'string') {
                return { id: quiz, title: 'Unknown Quiz', description: '', timeLimit: 0 };
            }
            return {
                id: quiz.id || (quiz._id ? quiz._id.toString() : ''),
                title: quiz.title || 'Untitled Quiz',
                description: quiz.description || '',
                timeLimit: quiz.timeLimit || 0
            };
        }) : [];

        res.json({
            section: {
                id: section._id.toString(),
                name: section.name,
                files: section.data || [],
                links: section.links || [],
                quizzes: formattedQuizzes
            }
        });
    } catch (err) {
        next(err);
    }
});

router.post('/add_section', checkAuthorization, async (req, res, next) => {
    try {
        const { name, course_id } = req.body;

        if (!name || !course_id) {
            return res.status(400).json({ error: 'Name and course_id are required' });
        }

        const newSection = await addSection({
            name,
            courseId: course_id
        });

        res.status(201).json({
            message: 'Section added successfully',
            section_id: newSection._id.toString()
        });
    } catch (err) {
        if (err.status === 404) {
            return res.status(404).json({ error: err.message });
        }
        next(err);
    }
});

export { router };
