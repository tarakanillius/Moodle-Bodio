import express from 'express';
import multer from 'multer';
import path from 'path';
import {
    UPLOAD_FOLDER,
    isAllowedFile
} from '../utils/file_utils.js';
import { addFileToSection } from '../utils/section_utils.js';
import { checkAuthorization } from '../utils/auth.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_FOLDER);
    },
    filename: (req, file, cb) => {
        // Create unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 16 * 1024 * 1024 }, // 16MB limit
    fileFilter: (req, file, cb) => {
        if (isAllowedFile(file.originalname)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});

router.post('/upload_file', checkAuthorization, upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const { section_id } = req.body;

        if (!section_id) {
            return res.status(400).json({ error: 'Section ID is required' });
        }

        // Generate file URL
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        // Add file to section in database
        await addFileToSection(section_id, req.file.originalname, fileUrl);

        res.json({
            message: 'File uploaded successfully',
            file_url: fileUrl
        });
    } catch (err) {
        if (err.status === 404) {
            return res.status(404).json({ error: err.message });
        }
        next(err);
    }
});

router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large (max 16MB)' });
        }
        return res.status(400).json({ error: err.message });
    }

    if (err.message === 'Invalid file type') {
        return res.status(400).json({ error: 'Invalid file type' });
    }

    next(err);
});

export { router };
