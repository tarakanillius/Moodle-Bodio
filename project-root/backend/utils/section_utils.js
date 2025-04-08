import { connectToDatabase } from '../db/connections.js';
import { ObjectId } from 'mongodb';

async function getSections() {
    const db = await connectToDatabase();
    return await db.collection('sections').find({}).toArray();
}

async function getSectionById(id) {
    const db = await connectToDatabase();
    return await db.collection('sections').findOne({ _id: new ObjectId(id) });
}

async function addSection({ name, courseId }) {
    const db = await connectToDatabase();

    // Verify course exists
    const course = await db.collection('courses').findOne({
        _id: new ObjectId(courseId)
    });

    if (!course) {
        throw { message: 'Course not found', status: 404 };
    }

    const newSection = {
        name,
        data: []
    };

    const result = await db.collection('sections').insertOne(newSection);

    // Update course with new section
    await db.collection('courses').updateOne(
        { _id: new ObjectId(courseId) },
        { $push: { sections: result.insertedId } }
    );

    return { ...newSection, _id: result.insertedId };
}

async function addFileToSection(sectionId, fileName, fileUrl) {
    const db = await connectToDatabase();

    // Verify section exists
    const section = await db.collection('sections').findOne({
        _id: new ObjectId(sectionId)
    });

    if (!section) {
        throw { message: 'Section not found', status: 404 };
    }

    // Add file to section
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
