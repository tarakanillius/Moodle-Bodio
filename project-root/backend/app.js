import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { router as userRouter } from './routes/users.js';
import { router as sectionRouter } from './routes/sections.js';
import { router as courseRouter } from './routes/courses.js';
import { router as fileRouter } from './routes/files.js';
import { router as quizRouter } from './routes/quizzes.js';
import { router as linkRouter } from './routes/links.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

const UPLOAD_FOLDER = path.join(__dirname, 'files', 'uploads');
app.use('/uploads', express.static(UPLOAD_FOLDER));

app.use(courseRouter);
app.use(userRouter);
app.use(sectionRouter);
app.use(fileRouter);
app.use(quizRouter);
app.use(linkRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
