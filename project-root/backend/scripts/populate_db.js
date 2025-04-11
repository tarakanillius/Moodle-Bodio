import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '..', 'files', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

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

        const quizzes_data = [];
        const quiz_ids = {};

        const quiz_templates = {
            "M320": [
                {
                    title: "OOP Fundamentals Quiz",
                    description: "Test your knowledge of object-oriented programming basics",
                    timeLimit: 20,
                    questions: [
                        {
                            id: new ObjectId().toString(),
                            text: "What does OOP stand for?",
                            type: "multiple_choice",
                            options: [
                                { id: new ObjectId().toString(), text: "Object-Oriented Programming", isCorrect: true },
                                { id: new ObjectId().toString(), text: "Object-Oriented Protocol", isCorrect: false },
                                { id: new ObjectId().toString(), text: "Online Object Programming", isCorrect: false },
                                { id: new ObjectId().toString(), text: "Optimized Object Programming", isCorrect: false }
                            ],
                            points: 1
                        },
                        {
                            id: new ObjectId().toString(),
                            text: "Which of the following are pillars of OOP?",
                            type: "multiple_choice",
                            options: [
                                { id: new ObjectId().toString(), text: "Encapsulation", isCorrect: true },
                                { id: new ObjectId().toString(), text: "Inheritance", isCorrect: true },
                                { id: new ObjectId().toString(), text: "Polymorphism", isCorrect: true },
                                { id: new ObjectId().toString(), text: "Abstraction", isCorrect: true },
                                { id: new ObjectId().toString(), text: "Compilation", isCorrect: false }
                            ],
                            points: 2
                        },
                        {
                            id: new ObjectId().toString(),
                            text: "Is a class a blueprint for objects?",
                            type: "true_false",
                            options: [
                                { id: new ObjectId().toString(), text: "True", isCorrect: true },
                                { id: new ObjectId().toString(), text: "False", isCorrect: false }
                            ],
                            points: 1
                        }
                    ]
                },
                {
                    title: "Inheritance Quiz",
                    description: "Test your understanding of inheritance in OOP",
                    timeLimit: 15,
                    questions: [
                        {
                            id: new ObjectId().toString(),
                            text: "What is inheritance in OOP?",
                            type: "multiple_choice",
                            options: [
                                { id: new ObjectId().toString(), text: "A mechanism where a class inherits properties from multiple interfaces", isCorrect: false },
                                { id: new ObjectId().toString(), text: "A process of hiding implementation details", isCorrect: false },
                                { id: new ObjectId().toString(), text: "A way to create multiple instances of a class", isCorrect: false }
                            ],
                            points: 1
                        },
                        {
                            id: new ObjectId().toString(),
                            text: "Can a class inherit from multiple classes in Java?",
                            type: "true_false",
                            options: [
                                { id: new ObjectId().toString(), text: "True", isCorrect: false },
                                { id: new ObjectId().toString(), text: "False", isCorrect: true }
                            ],
                            points: 1
                        }
                    ]
                }
            ],
            "M293": [
                {
                    title: "HTML Basics Quiz",
                    description: "Test your knowledge of HTML fundamentals",
                    timeLimit: 15,
                    questions: [
                        {
                            id: new ObjectId().toString(),
                            text: "What does HTML stand for?",
                            type: "multiple_choice",
                            options: [
                                { id: new ObjectId().toString(), text: "Hyper Text Markup Language", isCorrect: true },
                                { id: new ObjectId().toString(), text: "High Tech Modern Language", isCorrect: false },
                                { id: new ObjectId().toString(), text: "Hyper Transfer Markup Language", isCorrect: false },
                                { id: new ObjectId().toString(), text: "Home Tool Markup Language", isCorrect: false }
                            ],
                            points: 1
                        },
                        {
                            id: new ObjectId().toString(),
                            text: "Which tag is used to create a hyperlink?",
                            type: "multiple_choice",
                            options: [
                                { id: new ObjectId().toString(), text: "<a>", isCorrect: true },
                                { id: new ObjectId().toString(), text: "<h>", isCorrect: false },
                                { id: new ObjectId().toString(), text: "<link>", isCorrect: false },
                                { id: new ObjectId().toString(), text: "<href>", isCorrect: false }
                            ],
                            points: 1
                        }
                    ]
                }
            ],
            "M426": [
                {
                    title: "Agile Methodologies Quiz",
                    description: "Test your knowledge of agile development practices",
                    timeLimit: 25,
                    questions: [
                        {
                            id: new ObjectId().toString(),
                            text: "Which of the following are Agile frameworks?",
                            type: "multiple_choice",
                            options: [
                                { id: new ObjectId().toString(), text: "Scrum", isCorrect: true },
                                { id: new ObjectId().toString(), text: "Kanban", isCorrect: true },
                                { id: new ObjectId().toString(), text: "Waterfall", isCorrect: false },
                                { id: new ObjectId().toString(), text: "Extreme Programming (XP)", isCorrect: true }
                            ],
                            points: 2
                        },
                        {
                            id: new ObjectId().toString(),
                            text: "In Scrum, what is a Sprint?",
                            type: "multiple_choice",
                            options: [
                                { id: new ObjectId().toString(), text: "A time-boxed period when a specific work has to be completed", isCorrect: true },
                                { id: new ObjectId().toString(), text: "A quick meeting to discuss progress", isCorrect: false },
                                { id: new ObjectId().toString(), text: "A tool for tracking bugs", isCorrect: false },
                                { id: new ObjectId().toString(), text: "A type of documentation", isCorrect: false }
                            ],
                            points: 1
                        }
                    ]
                }
            ],
            "M165": [
                {
                    title: "NoSQL Databases Quiz",
                    description: "Test your knowledge of NoSQL database concepts",
                    timeLimit: 20,
                    questions: [
                        {
                            id: new ObjectId().toString(),
                            text: "Which of the following are types of NoSQL databases?",
                            type: "multiple_choice",
                            options: [
                                { id: new ObjectId().toString(), text: "Document stores", isCorrect: true },
                                { id: new ObjectId().toString(), text: "Key-value stores", isCorrect: true },
                                { id: new ObjectId().toString(), text: "Column-oriented databases", isCorrect: true },
                                { id: new ObjectId().toString(), text: "Graph databases", isCorrect: true },
                                { id: new ObjectId().toString(), text: "Relational databases", isCorrect: false }
                            ],
                            points: 2
                        },
                        {
                            id: new ObjectId().toString(),
                            text: "MongoDB is a document-oriented NoSQL database",
                            type: "true_false",
                            options: [
                                { id: new ObjectId().toString(), text: "True", isCorrect: true },
                                { id: new ObjectId().toString(), text: "False", isCorrect: false }
                            ],
                            points: 1
                        }
                    ]
                }
            ],
            "M322": [
                {
                    title: "UI/UX Design Quiz",
                    description: "Test your knowledge of user interface and experience design",
                    timeLimit: 15,
                    questions: [
                        {
                            id: new ObjectId().toString(),
                            text: "What does UI stand for?",
                            type: "multiple_choice",
                            options: [
                                { id: new ObjectId().toString(), text: "User Interface", isCorrect: true },
                                { id: new ObjectId().toString(), text: "User Interaction", isCorrect: false },
                                { id: new ObjectId().toString(), text: "User Implementation", isCorrect: false },
                                { id: new ObjectId().toString(), text: "User Integration", isCorrect: false }
                            ],
                            points: 1
                        },
                        {
                            id: new ObjectId().toString(),
                            text: "What does UX stand for?",
                            type: "multiple_choice",
                            options: [
                                { id: new ObjectId().toString(), text: "User Experience", isCorrect: true },
                                { id: new ObjectId().toString(), text: "User Examination", isCorrect: false },
                                { id: new ObjectId().toString(), text: "User Extension", isCorrect: false },
                                { id: new ObjectId().toString(), text: "User Exploration", isCorrect: false }
                            ],
                            points: 1
                        }
                    ]
                }
            ]
        };

        for (const [course_name, quizzes] of Object.entries(quiz_templates)) {
            quiz_ids[course_name] = [];

            for (const quiz of quizzes) {
                const quiz_id = new ObjectId();
                quiz_ids[course_name].push(quiz_id);

                quizzes_data.push({
                    _id: quiz_id,
                    title: quiz.title,
                    description: quiz.description,
                    timeLimit: quiz.timeLimit,
                    questions: quiz.questions,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
            }
        }

        const sections_data = [];
        const section_ids = {};

        const section_templates = {
            "M320": [
                {
                    name: "Introduzione alla OOP",
                    links: [
                        {
                            _id: new ObjectId(),
                            title: "Introduction to OOP Concepts",
                            url: "https://www.w3schools.com/java/java_oop.asp",
                            description: "W3Schools tutorial on OOP concepts"
                        },
                        {
                            _id: new ObjectId(),
                            title: "Object-Oriented Programming in Java",
                            url: "https://docs.oracle.com/javase/tutorial/java/concepts/",
                            description: "Oracle's official Java tutorials on OOP"
                        }
                    ],
                    quizzes: [quiz_ids["M320"][0]],
                },
                {
                    name: "Classi e Oggetti",
                    links: [
                        {
                            _id: new ObjectId(),
                            title: "Classes and Objects in Java",
                            url: "https://www.javatpoint.com/object-and-class-in-java",
                            description: "JavaTPoint tutorial on classes and objects"
                        }
                    ],
                    quizzes: []
                },
                {
                    name: "Ereditarietà",
                    links: [
                        {
                            _id: new ObjectId(),
                            title: "Inheritance in Java",
                            url: "https://www.geeksforgeeks.org/inheritance-in-java/",
                            description: "GeeksForGeeks tutorial on inheritance"
                        }
                    ],
                    quizzes: [quiz_ids["M320"][1]]
                },
                {
                    name: "Polimorfismo",
                    links: [
                        {
                            _id: new ObjectId(),
                            title: "Polymorphism in Java",
                            url: "https://www.programiz.com/java-programming/polymorphism",
                            description: "Programiz tutorial on polymorphism"
                        }
                    ],
                    quizzes: []
                }
            ],
            "M293": [
                {
                    name: "HTML Basics",
                    links: [
                        {
                            _id: new ObjectId(),
                            title: "HTML Tutorial",
                            url: "https://www.w3schools.com/html/",
                            description: "W3Schools HTML tutorial"
                        }
                    ],
                    quizzes: [quiz_ids["M293"][0]]
                },
                {
                    name: "CSS Styling",
                    links: [
                        {
                            _id: new ObjectId(),
                            title: "CSS Tutorial",
                            url: "https://www.w3schools.com/css/",
                            description: "W3Schools CSS tutorial"
                        }
                    ],
                    quizzes: []
                },
                {
                    name: "JavaScript Interattivo",
                    links: [
                        {
                            _id: new ObjectId(),
                            title: "JavaScript Tutorial",
                            url: "https://www.w3schools.com/js/",
                            description: "W3Schools JavaScript tutorial"
                        }
                    ],
                    quizzes: []
                },
                {
                    name: "Pubblicazione Web",
                    links: [
                        {
                            _id: new ObjectId(),
                            title: "Web Hosting Guide",
                            url: "https://www.hostinger.com/tutorials/website-hosting/",
                            description: "Hostinger guide on web hosting"
                        }
                    ],
                    quizzes: []
                }
            ],
            "M426": [
                {
                    name: "Metodologie Agili",
                    links: [
                        {
                            _id: new ObjectId(),
                            title: "Agile Manifesto",
                            url: "https://agilemanifesto.org/",
                            description: "The original Agile Manifesto"
                        }
                    ],
                    quizzes: [quiz_ids["M426"][0]]
                },
                {
                    name: "Scrum",
                    links: [
                        {
                            _id: new ObjectId(),
                            title: "Scrum Guide",
                            url: "https://scrumguides.org/",
                            description: "The official Scrum Guide"
                        }
                    ],
                    quizzes: []
                },
                {
                    name: "Kanban",
                    links: [
                        {
                            _id: new ObjectId(),
                            title: "Kanban Guide",
                            url: "https://www.atlassian.com/agile/kanban",
                            description: "Atlassian's guide to Kanban"
                        }
                    ],
                    quizzes: []
                },
                {
                    name: "Test Driven Development",
                    links: [
                        {
                            _id: new ObjectId(),
                            title: "TDD Tutorial",
                            url: "https://www.guru99.com/test-driven-development.html",
                            description: "Guru99's guide to Test Driven Development"
                        }
                    ],
                    quizzes: []
                }
            ],
            "M165": [
                {
                    name: "Introduzione a NoSQL",
                    links: [
                        {
                            _id: new ObjectId(),
                            title: "NoSQL Databases Explained",
                            url: "https://www.mongodb.com/nosql-explained",
                            description: "MongoDB's guide to NoSQL databases"
                        }
                    ],
                    quizzes: [quiz_ids["M165"][0]]
                },
                {
                    name: "MongoDB",
                    links: [
                        {
                            _id: new ObjectId(),
                            title: "MongoDB Tutorial",
                            url: "https://www.tutorialspoint.com/mongodb/",
                            description: "TutorialsPoint MongoDB tutorial"
                        }
                    ],
                    quizzes: []
                },
                {
                    name: "Redis",
                    links: [
                        {
                            _id: new ObjectId(),
                            title: "Redis Tutorial",
                            url: "https://redis.io/docs/",
                            description: "Official Redis documentation"
                        }
                    ],
                    quizzes: []
                },
                {
                    name: "Cassandra",
                    links: [
                        {
                            _id: new ObjectId(),
                            title: "Cassandra Tutorial",
                            url: "https://www.tutorialspoint.com/cassandra/",
                            description: "TutorialsPoint Cassandra tutorial"
                        }
                    ],
                    quizzes: []
                }
            ],
            "M322": [
                {
                    name: "Principi di UI/UX",
                    links: [
                        {
                            _id: new ObjectId(),
                            title: "UI/UX Design Principles",
                            url: "https://www.interaction-design.org/literature/topics/ui-design",
                            description: "Interaction Design Foundation's guide to UI design"
                        }
                    ],
                    quizzes: [quiz_ids["M322"][0]]
                },
                {
                    name: "Frameworks UI",
                    links: [
                        {
                            _id: new ObjectId(),
                            title: "Top UI Frameworks",
                            url: "https://www.creative-tim.com/blog/web-design/best-ui-frameworks/",
                            description: "Overview of popular UI frameworks"
                        }
                    ],                    quizzes: []
                },
                {
                    name: "Responsive Design",
                    links: [
                        {
                            _id: new ObjectId(),
                            title: "Responsive Web Design",
                            url: "https://www.w3schools.com/css/css_rwd_intro.asp",
                            description: "W3Schools guide to responsive web design"
                        }
                    ],
                    quizzes: []
                },
                {
                    name: "Accessibilità",
                    links: [
                        {
                            _id: new ObjectId(),
                            title: "Web Accessibility Guidelines",
                            url: "https://www.w3.org/WAI/standards-guidelines/wcag/",
                            description: "W3C Web Accessibility Initiative guidelines"
                        }
                    ],
                    quizzes: []
                }
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
                    links: section.links || [],
                    quizzes: section.quizzes || [],
                    files: []
                });
            }
        }

        const courses_data = [
            {
                _id: new ObjectId(),
                name: "M320",
                description: "Programmazione orientata a oggetti",
                teacher: teacher1_id,
                sections: section_ids["M320"],
                students: getRandomSubset(student_ids, 16),
                color: "#c15656",
            },
            {
                _id: new ObjectId(),
                name: "M293",
                description: "Creare e pubblicare una pagina web",
                teacher: teacher2_id,
                sections: section_ids["M293"],
                students: getRandomSubset(student_ids, 8),
                color: "#7f18d3",
            },
            {
                _id: new ObjectId(),
                name: "M426",
                description: "Sviluppare software con metodi agili",
                teacher: teacher2_id,
                sections: section_ids["M426"],
                students: getRandomSubset(student_ids, 8),
                color: "#f49627",
            },
            {
                _id: new ObjectId(),
                name: "M165",
                description: "Utilizzare banche dati NoSQL",
                teacher: teacher3_id,
                sections: section_ids["M165"],
                students: getRandomSubset(student_ids, 8),
                color: "#2738a6",
            },
            {
                _id: new ObjectId(),
                name: "M322",
                description: "Sviluppare interfacce grafiche",
                teacher: teacher1_id,
                sections: section_ids["M322"],
                students: getRandomSubset(student_ids, 8),
                color: "#45b54f",
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
        await db.collection('quiz').insertMany(quizzes_data);

        console.log('Database populated successfully with the new schema including quizzes and links.');
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

