import express from 'express';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../db/connections.js';
import { checkAuthorization } from '../utils/auth.js';

const router = express.Router();

router.post('/add_link', checkAuthorization, async (req, res) => {
    try {
        const { title, url, description, section_id } = req.body;

        if (!title || !url || !section_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const db = await connectToDatabase();

        const link = {
            id: new ObjectId().toString(),
            title,
            url,
            description: description || '',
            createdAt: new Date()
        };

        const result = await db.collection('sections').updateOne(
            { _id: new ObjectId(section_id) },
            { $push: { links: link } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Section not found' });
        }

        res.status(201).json({
            message: 'Link added successfully',
            link_id: link.id
        });
    } catch (error) {
        console.error('Error adding link:', error);
        res.status(500).json({ error: 'Failed to add link' });
    }
});

router.delete('/delete_link/:section_id/:link_id', checkAuthorization, async (req, res) => {
    try {
        const { section_id, link_id } = req.params;

        if (!section_id || !link_id) {
            return res.status(400).json({ error: 'Missing section ID or link ID' });
        }

        const db = await connectToDatabase();

        const result = await db.collection('sections').updateOne(
            { _id: new ObjectId(section_id) },
            { $pull: { links: { id: link_id } } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Section not found' });
        }

        res.json({ message: 'Link deleted successfully' });
    } catch (error) {
        console.error('Error deleting link:', error);
        res.status(500).json({ error: 'Failed to delete link' });
    }
});

export { router };
