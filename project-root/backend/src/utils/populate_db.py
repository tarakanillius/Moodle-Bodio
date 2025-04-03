from pymongo import MongoClient
from bson import ObjectId
import bcrypt
import datetime
import random

# CHANGE HERE CREDENTIALS
client = MongoClient("mongodb+srv://julie:Passworddb123@cluster1.28syrfz.mongodb.net/")
db = client["Moodle-Bodio"]

db.users.drop()
db.courses.drop()
db.sections.drop()

teacher1_id = ObjectId()
teacher2_id = ObjectId()
teacher3_id = ObjectId()

teachers_data = [
    {
        "_id": teacher1_id,
        "name": "Davide",
        "surname": "Krähenbühl",
        "sex": "male",
        "birth": datetime.datetime(1985, 5, 15),
        "email": "davide.krahenbuhl@example.com",
        "password_hash": bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        "role": "teacher",
        "courses": []
    },
    {
        "_id": teacher2_id,
        "name": "Gionata",
        "surname": "Genazzi",
        "sex": "male",
        "birth": datetime.datetime(1982, 8, 22),
        "email": "gionata.genazzi@example.com",
        "password_hash": bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        "role": "teacher",
        "courses": []
    },
    {
        "_id": teacher3_id,
        "name": "Simone",
        "surname": "Debortoli",
        "sex": "male",
        "birth": datetime.datetime(1978, 3, 10),
        "email": "simone.debortoli@example.com",
        "password_hash": bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        "role": "teacher",
        "courses": []
    }
]

student_ids = []
students_data = []

male_names = ["Marco", "Luca", "Alessandro", "Giuseppe", "Giovanni", "Antonio", "Francesco", "Roberto", "Matteo", "Andrea"]
female_names = ["Sofia", "Giulia", "Martina", "Chiara", "Francesca", "Sara", "Valentina", "Laura", "Anna", "Maria"]

last_names = ["Rossi", "Bianchi", "Ferrari", "Esposito", "Romano", "Colombo", "Ricci", "Marino", "Greco", "Bruno"]

for i in range(20):
    student_id = ObjectId()
    student_ids.append(student_id)

    gender = "male" if i % 2 == 0 else "female"
    first_name = random.choice(male_names if gender == "male" else female_names)
    last_name = random.choice(last_names)

    year = random.randint(1995, 2005)
    month = random.randint(1, 12)
    day = random.randint(1, 28)

    students_data.append({
        "_id": student_id,
        "name": first_name,
        "surname": last_name,
        "sex": gender,
        "birth": datetime.datetime(year, month, day),
        "email": f"{first_name.lower()}.{last_name.lower()}@example.com",
        "password_hash": bcrypt.hashpw("12345678".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        "role": "student",
        "courses": []
    })

sections_data = []
section_ids = {}

section_templates = {
    "M320": [
        {"name": "Introduzione alla OOP", "data": []},
        {"name": "Classi e Oggetti", "data": []},
        {"name": "Ereditarietà", "data": []},
        {"name": "Polimorfismo", "data": []}
    ],
    "M293": [
        {"name": "HTML Basics", "data": []},
        {"name": "CSS Styling", "data": []},
        {"name": "JavaScript Interattivo", "data": []},
        {"name": "Pubblicazione Web", "data": []}
    ],
    "M426": [
        {"name": "Metodologie Agili", "data": []},
        {"name": "Scrum", "data": []},
        {"name": "Kanban", "data": []},
        {"name": "Test Driven Development", "data": []}
    ],
    "M165": [
        {"name": "Introduzione a NoSQL", "data": []},
        {"name": "MongoDB", "data": []},
        {"name": "Redis", "data": []},
        {"name": "Cassandra", "data": []}
    ],
    "M322": [
        {"name": "Principi di UI/UX", "data": []},
        {"name": "Frameworks UI", "data": []},
        {"name": "Responsive Design", "data": []},
        {"name": "Accessibilità", "data": []}
    ]
}

for course_name, sections in section_templates.items():
    section_ids[course_name] = []
    for section in sections:
        section_id = ObjectId()
        section_ids[course_name].append(section_id)
        sections_data.append({
            "_id": section_id,
            "name": section["name"],
            "data": section["data"]
        })

courses_data = [
    {
        "_id": ObjectId(),
        "name": "M320",
        "description": "Programmazione orientata a oggetti",
        "teacher": teacher1_id,
        "sections": section_ids["M320"],
        "students": random.sample(student_ids, 16),
        "color": "rgba(0, 170, 255, 0.11)",
    },
    {
        "_id": ObjectId(),
        "name": "M293",
        "description": "Creare e pubblicare una pagina web",
        "teacher": teacher2_id,
        "sections": section_ids["M293"],
        "students": random.sample(student_ids, 8),
        "color": "rgba(120, 255, 0, 0.11)"
    },
    {
        "_id": ObjectId(),
        "name": "M426",
        "description": "Sviluppare software con metodi agili",
        "teacher": teacher2_id,
        "sections": section_ids["M426"],
        "students": random.sample(student_ids, 8),
        "color": "rgba(255, 189, 0, 0.11)"
    },
    {
        "_id": ObjectId(),
        "name": "M165",
        "description": "Utilizzare banche dati NoSQL",
        "teacher": teacher3_id,
        "sections": section_ids["M165"],
        "students": random.sample(student_ids, 8),
        "color": "rgba(166, 0, 255, 0.11)"
    },
    {
        "_id": ObjectId(),
        "name": "M322",
        "description": "Sviluppare interfacce grafiche",
        "teacher": teacher1_id,
        "sections": section_ids["M322"],
        "students": random.sample(student_ids, 8),
        "color": "rgba(255, 0, 0, 0.11)"
    }
]

for course in courses_data:
    for teacher in teachers_data:
        if teacher["_id"] == course["teacher"]:
            teacher["courses"].append(course["_id"])

for course in courses_data:
    for student_id in course["students"]:
        for student in students_data:
            if student["_id"] == student_id:
                student["courses"].append(course["_id"])

db.users.insert_many(teachers_data + students_data)
db.sections.insert_many(sections_data)
db.courses.insert_many(courses_data)

print("Database popolato con successo con il nuovo schema.")
