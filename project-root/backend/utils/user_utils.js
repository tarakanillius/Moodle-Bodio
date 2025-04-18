import { connectToDatabase } from '../db/connections.js';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

async function getUsers(role) {
    const db = await connectToDatabase();
    return await db.collection('users').find({ role }).toArray();
}

async function getStudents() {
    return getUsers('student');
}

async function getUserById(id) {
    const db = await connectToDatabase();
    return await db.collection('users').findOne({ _id: new ObjectId(id) });
}

async function getUserByEmail(email) {
    const db = await connectToDatabase();
    const user = await db.collection('users').findOne({ email });
    if (!user) {
        throw { message: `Could not find user ${email}`, status: 404 };
    }
    return user;
}

async function formatUser(user) {
    if (!user) return null;

    const birth = user.birth;
    return {
        id: user._id.toString(),
        name: user.name || '',
        surname: user.surname || '',
        email: user.email || '',
        role: user.role || '',
        sex: user.sex || '',
        birth: birth ? birth.toISOString().split('T')[0] : null,
        courses: user.courses ? user.courses.map(c => c.toString()) : []
    };
}

async function getUserCourses(userId) {
    const db = await connectToDatabase();

    try {
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

        if (!user) {
            throw { message: 'User not found', status: 404 };
        }

        if (!user.courses || user.courses.length === 0) {
            return [];
        }

        const courseIds = user.courses.map(id => new ObjectId(id));
        const courses = await db.collection('courses').find({ _id: { $in: courseIds } }).toArray();

        return courses.map(course => ({
            id: course._id.toString(),
            name: course.name,
            description: course.description,
            teacher: course.teacher ? course.teacher.toString() : null
        }));
    } catch (error) {
        if (error.status) {
            throw error;
        }
        console.error('Error getting user courses:', error);
        throw { message: 'Failed to retrieve user courses', status: 500 };
    }
}

async function addUser({ name, surname, email, role, sex, birth, password }) {
    const db = await connectToDatabase();

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
        throw { message: 'Email already registered', status: 400 };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = {
        name,
        surname,
        sex: sex || '',
        birth: birth ? new Date(birth) : null,
        email,
        password_hash: hashedPassword,
        role,
        courses: []
    };

    const result = await db.collection('users').insertOne(newUser);
    return { ...newUser, _id: result.insertedId };
}

async function updateUser(userId, userData) {
    const db = await connectToDatabase();

    const allowedFields = ['name', 'surname', 'email', 'sex'];
    const updateData = {};

    allowedFields.forEach(field => {
        if (userData[field] !== undefined) {
            updateData[field] = userData[field];
        }
    });

    if (userData.birth) {
        updateData.birth = new Date(userData.birth);
    }

    if (Object.keys(updateData).length === 0) {
        return { message: 'No fields to update' };
    }

    await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        { $set: updateData }
    );

    return { message: 'User updated successfully' };
}

async function deleteUser(id) {
    const db = await connectToDatabase();
    await db.collection('users').deleteOne({ _id: new ObjectId(id) });
    return { message: 'User deleted successfully' };
}

async function enrollStudent(studentId, courseId) {
    const db = await connectToDatabase();

    const studentObjId = new ObjectId(studentId);
    const courseObjId = new ObjectId(courseId);

    const student = await db.collection('users').findOne({
        _id: studentObjId,
        role: 'student'
    });

    const course = await db.collection('courses').findOne({
        _id: courseObjId
    });

    if (!student || !course) {
        throw {
            message: `${!student ? 'Student' : 'Course'} not found`,
            status: 404
        };
    }

    const isEnrolled = course.students.some(id => id.toString() === studentId);
    if (isEnrolled) {
        return { message: 'Student already enrolled in this course' };
    }

    await db.collection('courses').updateOne(
        { _id: courseObjId },
        { $push: { students: studentObjId } }
    );

    await db.collection('users').updateOne(
        { _id: studentObjId },
        { $push: { courses: courseObjId } }
    );

    return { message: 'Student enrolled successfully' };
}

async function unenrollStudent(student_id, course_id) {
    const db = await connectToDatabase();
    const studentObjId = new ObjectId(student_id);
    const courseObjId = new ObjectId(course_id);

    const student = await db.collection('users').findOne({
        _id: studentObjId,
        role: 'student'
    });

    if (!student) {
        throw { message: 'Student not found', status: 404 };
    }

    const course = await db.collection('courses').findOne({
        _id: courseObjId
    });

    if (!course) {
        throw { message: 'Course not found', status: 404 };
    }

    await db.collection('users').updateOne(
        { _id: studentObjId },
        { $pull: { courses: courseObjId } }
    );

    await db.collection('courses').updateOne(
        { _id: courseObjId },
        { $pull: { students: studentObjId } }
    );

    return { message: 'Student unenrolled successfully' };
}

export {
    getStudents,
    getUserById,
    getUserByEmail,
    formatUser,
    addUser,
    updateUser,
    deleteUser,
    enrollStudent,
    unenrollStudent,
    getUserCourses
};
