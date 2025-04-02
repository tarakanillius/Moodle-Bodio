from pymongo import MongoClient
from bson import ObjectId
import bcrypt
import datetime

# CHANGE HERE CREDENTIALS
client = MongoClient("mongodb://LOGIN:PASSWORD@localhost:27017/")
db = client["Moodle-Bodio"]

db.users.drop()
db.courses.drop()
db.sections.drop()

user1_id = ObjectId()
user2_id = ObjectId()

users_data = [
    {
        "_id": user1_id,
        "name": "Mario",
        "surname": "Rossi",
        "sex": "male",
        "birth": datetime.datetime(1985, 5, 15),
        "email": "mario.rossi@example.com",
        "password_hash": bcrypt.hashpw("password123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        "role": "teacher",
        "courses": []
    },
    {
        "_id": user2_id,
        "name": "Luca",
        "surname": "Bianchi",
        "sex": "male",
        "birth": datetime.datetime(1990, 8, 22),
        "email": "luca.bianchi@example.com",
        "password_hash": bcrypt.hashpw("12345678".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        "role": "student",
        "courses": []
    },
    {
        "_id": ObjectId(),
        "name": "Anna",
        "surname": "Verdi",
        "sex": "female",
        "birth": datetime.datetime(1988, 3, 10),
        "email": "anna.verdi@example.com",
        "password_hash": bcrypt.hashpw("securepass".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
        "role": "student",
        "courses": []
    }
]

section1_id = ObjectId()
section2_id = ObjectId()

sections_data = [
    {
        "_id": section1_id,
        "name": "Introduction to Python",
        "data": [
            {"name": "python_basics.pdf", "url": "http://example.com/python_basics.pdf"},
            {"name": "hello_world.py", "url": "http://127.0.0.1:5000/uploads/hello_world.py"}
        ]
    },
    {
        "_id": section2_id,
        "name": "Advanced Python Concepts",
        "data": [
            {"name": "advanced_python.pdf", "url": "http://example.com/advanced_python.pdf"}
        ]
    }
]

course1_id = ObjectId()

courses_data = [
    {
        "_id": course1_id,
        "name": "Python Programming",
        "description": "Learn Python from basics to advanced concepts",
        "teacher": user1_id,
        "sections": [section1_id, section2_id],
        "students": [user2_id]
    }
]

users_data[0]["courses"] = [course1_id]
users_data[1]["courses"] = [course1_id]

db.users.insert_many(users_data)
db.sections.insert_many(sections_data)
db.courses.insert_many(courses_data)

print("Database populated successfully with the new schema.")
