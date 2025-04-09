import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'files', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// MongoDB connection
const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_DATABASE;

async function populateDatabase() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(dbName);

        await db.collection('users').drop().catch(() => console.log('No users collection to drop'));
        await db.collection('courses').drop().catch(() => console.log('No courses collection to drop'));
        await db.collection('sections').drop().catch(() => console.log('No sections collection to drop'));
        await db.collection('quiz').drop().catch(() => console.log('No quiz collection to drop'));

        const teacher1_id = new ObjectId();
        const teacher2_id = new ObjectId();
        const teacher3_id = new ObjectId();

        const teachers_data = [
            {
                _id: teacher1_id,
                name: "Davide",
                surname: "Krähenbühl",
                sex: "male",
                birth: new Date(1985, 4, 15),
                email: "davide.krahenbuhl@example.com",
                password_hash: await bcrypt.hash("password123", 12),
                role: "teacher",
                courses: []
            },
            {
                _id: teacher2_id,
                name: "Gionata",
                surname: "Genazzi",
                sex: "male",
                birth: new Date(1982, 7, 22),
                email: "gionata.genazzi@example.com",
                password_hash: await bcrypt.hash("password123", 12),
                role: "teacher",
                courses: []
            },
            {
                _id: teacher3_id,
                name: "Simone",
                surname: "Debortoli",
                sex: "male",
                birth: new Date(1978, 2, 10),
                email: "simone.debortoli@example.com",
                password_hash: await bcrypt.hash("password123", 12),
                role: "teacher",
                courses: []
            }
        ];

        // Create student data
        const student_ids = [];
        const students_data = [];

        const male_names = ["Marco", "Luca", "Alessandro", "Giuseppe", "Giovanni", "Antonio", "Francesco", "Roberto", "Matteo", "Andrea"];
        const female_names = ["Sofia", "Giulia", "Martina", "Chiara", "Francesca", "Sara", "Valentina", "Laura", "Anna", "Maria"];
        const last_names = ["Rossi", "Bianchi", "Ferrari", "Esposito", "Romano", "Colombo", "Ricci", "Marino", "Greco", "Bruno"];

        for (let i = 0; i < 20; i++) {
            const student_id = new ObjectId();
            student_ids.push(student_id);

            const gender = i % 2 === 0 ? "male" : "female";
            const first_name = gender === "male"
                ? male_names[Math.floor(Math.random() * male_names.length)]
                : female_names[Math.floor(Math.random() * female_names.length)];
            const last_name = last_names[Math.floor(Math.random() * last_names.length)];

            const year = Math.floor(Math.random() * (2005 - 1995 + 1)) + 1995;
            const month = Math.floor(Math.random() * 12);
            const day = Math.floor(Math.random() * 28) + 1;

            students_data.push({
                _id: student_id,
                name: first_name,
                surname: last_name,
                sex: gender,
                birth: new Date(year, month, day),
                email: `${first_name.toLowerCase()}.${last_name.toLowerCase()}@example.com`,
                password_hash: await bcrypt.hash("12345678", 12),
                role: "student",
                courses: []
            });
        }

        // Create section templates
        const sections_data = [];
        const section_ids = {};

        const section_templates = {
            "M320": [
                { name: "Introduzione alla OOP", data: [] },
                { name: "Classi e Oggetti", data: [] },
                { name: "Ereditarietà", data: [] },
                { name: "Polimorfismo", data: [] }
            ],
            "M293": [
                { name: "HTML Basics", data: [] },
                { name: "CSS Styling", data: [] },
                { name: "JavaScript Interattivo", data: [] },
                { name: "Pubblicazione Web", data: [] }
            ],
            "M426": [
                { name: "Metodologie Agili", data: [] },
                { name: "Scrum", data: [] },
                { name: "Kanban", data: [] },
                { name: "Test Driven Development", data: [] }
            ],
            "M165": [
                { name: "Introduzione a NoSQL", data: [] },
                { name: "MongoDB", data: [] },
                { name: "Redis", data: [] },
                { name: "Cassandra", data: [] }
            ],
            "M322": [
                { name: "Principi di UI/UX", data: [] },
                { name: "Frameworks UI", data: [] },
                { name: "Responsive Design", data: [] },
                { name: "Accessibilità", data: [] }
            ]
        };

        for (const [course_name, sections] of Object.entries(section_templates)) {
            section_ids[course_name] = [];

            for (const section of sections) {
                const section_id = new ObjectId();
                section_ids[course_name].push(section_id);

                sections_data.push({
                    _id: section_id,
                    name: section.name,
                    data: section.data
                });
            }
        }

        // Create course data
        const courses_data = [
            {
                _id: new ObjectId(),
                name: "M320",
                description: "Programmazione orientata a oggetti",
                teacher: teacher1_id,
                sections: section_ids["M320"],
                students: getRandomSubset(student_ids, 16),
                color: "#00aaff",
            },
            {
                _id: new ObjectId(),
                name: "M293",
                description: "Creare e pubblicare una pagina web",
                teacher: teacher2_id,
                sections: section_ids["M293"],
                students: getRandomSubset(student_ids, 8),
                color: "#78ff00"
            },
            {
                _id: new ObjectId(),
                name: "M426",
                description: "Sviluppare software con metodi agili",
                teacher: teacher2_id,
                sections: section_ids["M426"],
                students: getRandomSubset(student_ids, 8),
                color: "#ffbd00"
            },
            {
                _id: new ObjectId(),
                name: "M165",
                description: "Utilizzare banche dati NoSQL",
                teacher: teacher3_id,
                sections: section_ids["M165"],
                students: getRandomSubset(student_ids, 8),
                color: "#a600ff"
            },
            {
                _id: new ObjectId(),
                name: "M322",
                description: "Sviluppare interfacce grafiche",
                teacher: teacher1_id,
                sections: section_ids["M322"],
                students: getRandomSubset(student_ids, 8),
                color: "#ff0000"
            }
        ];

        for (const course of courses_data) {
            for (const teacher of teachers_data) {
                if (teacher._id.equals(course.teacher)) {
                    teacher.courses.push(course._id);
                }
            }
        }

        for (const course of courses_data) {
            for (const student_id of course.students) {
                for (const student of students_data) {
                    if (student._id.equals(student_id)) {
                        student.courses.push(course._id);
                    }
                }
            }
        }

        await db.collection('users').insertMany([...teachers_data, ...students_data]);
        await db.collection('sections').insertMany(sections_data);
        await db.collection('courses').insertMany(courses_data);

        console.log('Database populated successfully.');
    } catch (error) {
        console.error('Error populating database:', error);
    } finally {
        await client.close();
    }
}

function getRandomSubset(array, size) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, size);
}

populateDatabase().catch(console.error);
