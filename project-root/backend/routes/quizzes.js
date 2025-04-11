import express from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../db/connections.js';
import { checkAuthorization } from '../utils/auth.js';

const router = express.Router();

router.get('/quiz/:id', checkAuthorization, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const quiz = await db.collection('quiz').findOne({ _id: new ObjectId(req.params.id) });

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        res.json({ quiz });
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({ error: 'Failed to fetch quiz' });
    }
});

router.post('/quiz', checkAuthorization, async (req, res) => {
    try {
        const { title, description, timeLimit, questions, section_id } = req.body;

        if (!title || !section_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const db = await connectToDatabase();

        const quiz = {
            title,
            description: description || '',
            timeLimit: parseInt(timeLimit) || 30,
            questions: questions || [],
            createdAt: new Date()
        };

        const result = await db.collection('quiz').insertOne(quiz);

        await db.collection('sections').updateOne(
            { _id: new ObjectId(section_id) },
            { $push: { quizzes: {
                        id: result.insertedId.toString(),
                        title: title,
                        description: description || '',
                        timeLimit: parseInt(timeLimit) || 30
                    } } }
        );

        res.status(201).json({
            message: 'Quiz created successfully',
            quiz_id: result.insertedId
        });
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({ error: 'Failed to create quiz' });
    }
});

router.put('/quiz/:id', checkAuthorization, async (req, res) => {
    try {
        const { title, description, timeLimit, questions } = req.body;

        if (!title) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const db = await connectToDatabase();

        const result = await db.collection('quiz').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: {
                    title,
                    description: description || '',
                    timeLimit: parseInt(timeLimit) || 30,
                    questions: questions || [],
                    updatedAt: new Date()
                } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        await db.collection('sections').updateMany(
            { "quizzes.id": req.params.id },
            { $set: {
                    "quizzes.$.title": title,
                    "quizzes.$.description": description || '',
                    "quizzes.$.timeLimit": parseInt(timeLimit) || 30
                } }
        );

        res.json({ message: 'Quiz updated successfully' });
    } catch (error) {
        console.error('Error updating quiz:', error);
        res.status(500).json({ error: 'Failed to update quiz' });
    }
});

router.delete('/quiz/:id', checkAuthorization, async (req, res) => {
    try {
        const db = await connectToDatabase();

        const result = await db.collection('quiz').deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        await db.collection('sections').updateMany(
            { "quizzes.id": req.params.id },
            { $pull: { quizzes: { id: req.params.id } } }
        );

        res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).json({ error: 'Failed to delete quiz' });
    }
});

router.post('/quiz-submit', checkAuthorization, async (req, res) => {
    try {
        const { quiz_id, user_id, answers } = req.body;

        if (!quiz_id || !user_id || !answers) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const db = await connectToDatabase();

        const quiz = await db.collection('quiz').findOne({ _id: new ObjectId(quiz_id) });

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

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

        const submission = {
            quiz_id: new ObjectId(quiz_id),
            user_id: new ObjectId(user_id),
            answers,
            score: scorePercentage,
            submittedAt: new Date()
        };

        const result = await db.collection('quiz_submissions').insertOne(submission);

        res.status(201).json({
            message: 'Quiz submitted successfully',
            submission_id: result.insertedId,
            score: scorePercentage
        });
    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({ error: 'Failed to submit quiz' });
    }
});

router.get('/quiz-results/:quizId/:userId', checkAuthorization, async (req, res) => {
    try {
        const { quizId, userId } = req.params;

        const db = await connectToDatabase();

        const submission = await db.collection('quiz_submissions').findOne(
            {
                quiz_id: new ObjectId(quizId),
                user_id: new ObjectId(userId)
            },
            { sort: { submittedAt: -1 } }
        );

        if (!submission) {
            return res.status(404).json({ error: 'No results found' });
        }

        res.json({
            score: submission.score,
            answers: submission.answers,
            completedAt: submission.submittedAt
        });
    } catch (error) {
        console.error('Error fetching quiz results:', error);
        res.status(500).json({ error: 'Failed to fetch quiz results' });
    }
});

router.post('/quizzes-by-ids', checkAuthorization, async (req, res) => {
    try {
        const { quizIds } = req.body;

        if (!quizIds || !Array.isArray(quizIds) || quizIds.length === 0) {
            return res.status(400).json({ error: 'Valid quiz IDs array is required' });
        }

        const db = await connectToDatabase();
        const objectIds = quizIds.map(id => new ObjectId(id));

        const quizzes = await db.collection('quiz').find({
            _id: { $in: objectIds }
        }).toArray();

        const formattedQuizzes = quizzes.map(quiz => ({
            id: quiz._id.toString(),
            title: quiz.title,
            description: quiz.description,
            timeLimit: quiz.timeLimit,
            questions: quiz.questions
        }));

        res.json({ quizzes: formattedQuizzes });
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).json({ error: 'Failed to fetch quizzes' });
    }
});

export { router };
