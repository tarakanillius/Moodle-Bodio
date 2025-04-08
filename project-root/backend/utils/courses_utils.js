import { connectToDatabase } from '../db/connections.js';
import { ObjectId } from 'mongodb';

async function getCourses() {
    const db = await connectToDatabase();
    return await db.collection('courses').find({}).toArray();
}

async function formatCourse(course, details = false) {
    if (!course) return null;

    const db = await connectToDatabase();
    const result = {
        id: course._id.toString(),
        name: course.name,
        description: course.description,
        color: course.color || 'rgba(0, 0, 0, 0.05)'
    };

    if (details) {
        // Get teacher details
        const teacher = await db.collection('users').findOne({ _id: course.teacher });
        result.teacher = teacher ? {
            id: teacher._id.toString(),
            name: `${teacher.name} ${teacher.surname}`
        } : null;

        // Get sections details
        result.sections = [];
        for (const sectionId of course.sections) {
            const section = await db.collection('sections').findOne({ _id: sectionId });
            if (section) {
                result.sections.push({
                    id: section._id.toString(),
                    name: section.name,
                    files: section.data
                });
            }
        }

        // Get students details
        result.students = [];
        for (const studentId of course.students) {
            const student = await db.collection('users').findOne({ _id: studentId });
            if (student) {
                result.students.push({
                    id: student._id.toString(),
                    name: `${student.name} ${student.surname}`,
                    email: student.email,
                    gender: student.sex || 'male'
                });
            }
        }
    }

    return result;
}

async function getCourseById(id) {
    const db = await connectToDatabase();
    return await db.collection('courses').findOne({ _id: new ObjectId(id) });
}

async function getStudentCourses(studentId) {
    const db = await connectToDatabase();
    const student = await db.collection('users').findOne({ _id: new ObjectId(studentId) });

    if (!student) {
        throw { message: 'Student not found', status: 404 };
    }

    const courses = await db.collection('courses').find({
        _id: { $in: student.courses || [] }
    }).toArray();

    return courses;
}

async function addCourse({ name, description, teacherId, color }) {
    const db = await connectToDatabase();

    const teacherObjId = new ObjectId(teacherId);

    // Verify teacher exists
    const teacher = await db.collection('users').findOne({
        _id: teacherObjId,
        role: 'teacher'
    });

    if (!teacher) {
        throw { message: 'Teacher not found', status: 404 };
    }

    const newCourse = {
        name,
        description,
        teacher: teacherObjId,
        sections: [],
        students: [],
        color: color || 'rgba(0, 0, 0, 0.05)'
    };

    const result = await db.collection('courses').insertOne(newCourse);

    // Update teacher with new course
    await db.collection('users').updateOne(
        { _id: teacherObjId },
        { $push: { courses: result.insertedId } }
    );

    return { ...newCourse, _id: result.insertedId };
}

async function updateCourse(courseId, courseData) {
    const db = await connectToDatabase();

    const allowedFields = ['name', 'description', 'color'];
    const updateData = {};

    allowedFields.forEach(field => {
        if (courseData[field] !== undefined) {
            updateData[field] = courseData[field];
        }
    });

    if (Object.keys(updateData).length === 0) {
        return { message: 'No fields to update' };
    }

    await db.collection('courses').updateOne(
        { _id: new ObjectId(courseId) },
        { $set: updateData }
    );

    return { message: 'Course updated successfully' };
}

async function deleteCourse(id) {
    const db = await connectToDatabase();
    const courseId = new ObjectId(id);

    // Get course details before deletion
    const course = await db.collection('courses').findOne({ _id: courseId });

    if (!course) {
        throw { message: 'Course not found', status: 404 };
    }

    // Remove course from students' courses array
    for (const studentId of course.students) {
        await db.collection('users').updateOne(
            { _id: studentId },
            { $pull: { courses: courseId } }
        );
    }

    // Remove course from teacher's courses array
    await db.collection('users').updateOne(
        { _id: course.teacher },
        { $pull: { courses: courseId } }
    );

    // Delete all sections associated with the course
    for (const sectionId of course.sections) {
        await db.collection('sections').deleteOne({ _id: sectionId });
    }

    // Delete the course
    await db.collection('courses').deleteOne({ _id: courseId });

    return { message: 'Course deleted successfully' };
}

export {
    getCourses,
    formatCourse,
    getCourseById,
    getStudentCourses,
    addCourse,
    updateCourse,
    deleteCourse
};
