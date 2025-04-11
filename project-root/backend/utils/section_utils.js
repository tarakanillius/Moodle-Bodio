import { connectToDatabase } from '../db/connections.js';
import { ObjectId } from 'mongodb';

async function getSections() {
    const db = await connectToDatabase();
    return await db.collection('sections').find({}).toArray();
}

async function getSectionById(id) {
    const db = await connectToDatabase();
    const section = await db.collection('sections').findOne({ _id: new ObjectId(id) });

    if (section && section.quizzes && section.quizzes.length > 0) {
        const quizIds = section.quizzes.map(quizId => new ObjectId(quizId));
        const quizzes = await db.collection('quiz').find({ _id: { $in: quizIds } }).toArray();

        const quizDetailsMap = {};
        quizzes.forEach(quiz => {
            quizDetailsMap[quiz._id.toString()] = {
                id: quiz._id.toString(),
                title: quiz.title,
                description: quiz.description,
                timeLimit: quiz.timeLimit
            };
        });

        section.quizzes = section.quizzes.map(quizId => {
            const quizIdStr = quizId.toString();
            return quizDetailsMap[quizIdStr] || { id: quizIdStr };
        });
    }

    return section;
}

async function addSection({ name, courseId }) {
    const db = await connectToDatabase();

    const course = await db.collection('courses').findOne({
        _id: new ObjectId(courseId)
    });

    if (!course) {
        throw { message: 'Course not found', status: 404 };
    }

    const newSection = {
        name,
        data: [],
        quizzes: [],
        links: []
    };

    const result = await db.collection('sections').insertOne(newSection);

    await db.collection('courses').updateOne(
        { _id: new ObjectId(courseId) },
        { $push: { sections: result.insertedId } }
    );

    return { ...newSection, _id: result.insertedId };
}

async function addFileToSection(sectionId, fileName, fileUrl) {
    const db = await connectToDatabase();

    const section = await db.collection('sections').findOne({
        _id: new ObjectId(sectionId)
    });

    if (!section) {
        throw { message: 'Section not found', status: 404 };
    }

    await db.collection('sections').updateOne(
        { _id: new ObjectId(sectionId) },
        { $push: { data: { name: fileName, url: fileUrl } } }
    );

    return { message: 'File added to section successfully' };
}

export {
    getSections,
    getSectionById,
    addSection,
    addFileToSection
};
