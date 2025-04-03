import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from pymongo import MongoClient
from bson import ObjectId
import bcrypt
import datetime

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

UPLOAD_FOLDER = 'uploads/'
ALLOWED_EXTENSIONS = {'docx', 'pptx', 'pdf', 'txt', 'py', 'js', 'html', 'css'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# CHANGE HERE CREDENTIALS
client = MongoClient("mongodb://admin:admin@localhost:27017/")
db = client["Moodle-Bodio"]
users = db["users"]
courses = db["courses"]
sections = db["sections"]

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/register', methods=['POST'])
def register_user():
    data = request.json

    if users.find_one({"email": data["email"]}):
        return jsonify({"error": "Email already registered"}), 400

    password_hash = bcrypt.hashpw(data["password"].encode('utf-8'), bcrypt.gensalt())

    new_user = {
        "name": data["name"],
        "surname": data["surname"],
        "sex": data.get("sex", ""),
        "birth": datetime.datetime.strptime(data["birth"], "%Y-%m-%d") if "birth" in data else None,
        "email": data["email"],
        "password_hash": password_hash.decode('utf-8'),
        "role": data["role"],
        "courses": []
    }

    user_id = users.insert_one(new_user).inserted_id
    return jsonify({"message": "User registered successfully", "user_id": str(user_id)}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = users.find_one({"email": data["email"]})

    if not user:
        return jsonify({"error": "User not found"}), 404

    if bcrypt.checkpw(data["password"].encode('utf-8'), user["password_hash"].encode('utf-8')):
        return jsonify({
            "message": "Login successful",
            "user_id": str(user["_id"]),
            "name": user["name"],
            "role": user["role"]
        }), 200
    else:
        return jsonify({"error": "Invalid password"}), 401

@app.route('/add_course', methods=['POST'])
def add_course():
    data = request.json

    teacher = users.find_one({"_id": ObjectId(data["teacher_id"]), "role": "teacher"})
    if not teacher:
        return jsonify({"error": "Teacher not found"}), 404

    new_course = {
        "name": data["name"],
        "description": data["description"],
        "teacher": ObjectId(data["teacher_id"]),
        "sections": [],
        "students": [],
        "color": data.get("color", "rgba(0, 0, 0, 0.05)")
    }

    course_id = courses.insert_one(new_course).inserted_id

    users.update_one(
        {"_id": ObjectId(data["teacher_id"])},
        {"$push": {"courses": course_id}}
    )

    return jsonify({"message": "Course added successfully", "course_id": str(course_id)}), 201

@app.route('/add_section', methods=['POST'])
def add_section():
    data = request.json
    course_id = data["course_id"]

    course = courses.find_one({"_id": ObjectId(course_id)})
    if not course:
        return jsonify({"error": "Course not found"}), 404

    new_section = {
        "name": data["name"],
        "data": []
    }

    section_id = sections.insert_one(new_section).inserted_id

    courses.update_one(
        {"_id": ObjectId(course_id)},
        {"$push": {"sections": section_id}}
    )

    return jsonify({
        "message": "Section added successfully",
        "section_id": str(section_id)
    }), 201

@app.route('/upload_file', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    section_id = request.form.get('section_id')

    section = sections.find_one({"_id": ObjectId(section_id)})
    if not section:
        return jsonify({"error": "Section not found"}), 404

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        file_url = f"http://127.0.0.1:5000/uploads/{filename}"

        sections.update_one(
            {"_id": ObjectId(section_id)},
            {"$push": {"data": {"name": filename, "url": file_url}}}
        )

        return jsonify({
            "message": "File uploaded successfully",
            "file_url": file_url
        }), 200
    else:
        return jsonify({"error": "Invalid file type"}), 400

@app.route('/enroll_student', methods=['POST'])
def enroll_student():
    data = request.json
    student_id = data["student_id"]
    course_id = data["course_id"]

    student = users.find_one({"_id": ObjectId(student_id), "role": "student"})
    course = courses.find_one({"_id": ObjectId(course_id)})

    if not student:
        return jsonify({"error": "Student not found"}), 404
    if not course:
        return jsonify({"error": "Course not found"}), 404

    if ObjectId(student_id) in course["students"]:
        return jsonify({"message": "Student already enrolled in this course"}), 200

    courses.update_one(
        {"_id": ObjectId(course_id)},
        {"$push": {"students": ObjectId(student_id)}}
    )

    users.update_one(
        {"_id": ObjectId(student_id)},
        {"$push": {"courses": ObjectId(course_id)}}
    )

    return jsonify({"message": "Student enrolled successfully"}), 200

@app.route('/student_courses/<student_id>', methods=['GET'])
def show_student_courses(student_id):
    try:
        student_obj_id = ObjectId(student_id)

        student = users.find_one({"_id": student_obj_id})

        if not student:
            return jsonify({"error": "Student not found"}), 404

        student_courses = courses.find({"_id": {"$in": student.get("courses", [])}})

        course_list = []
        for course in student_courses:
            course_list.append({
                "id": str(course["_id"]),
                "name": course["name"],
                "description": course["description"],
                "color": course.get("color", "rgba(0, 0, 0, 0.05)")
            })

        return jsonify({"courses": course_list}), 200
    except Exception as e:
        print(f"Error in student_courses: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/course/<course_id>', methods=['GET'])
def get_course(course_id):
    course = courses.find_one({"_id": ObjectId(course_id)})

    if not course:
        return jsonify({"error": "Course not found"}), 404

    teacher = users.find_one({"_id": course["teacher"]})
    teacher_info = {
        "id": str(teacher["_id"]),
        "name": f"{teacher['name']} {teacher['surname']}"
    } if teacher else None

    course_sections = []
    for section_id in course["sections"]:
        section = sections.find_one({"_id": section_id})
        if section:
            course_sections.append({
                "id": str(section["_id"]),
                "name": section["name"],
                "files": section["data"]
            })

    student_list = []
    for student_id in course["students"]:
        student = users.find_one({"_id": student_id})
        if student:
            student_list.append({
                "id": str(student["_id"]),
                "name": f"{student['name']} {student['surname']}",
                "email": student["email"],
                "gender": student.get("sex", "male")
            })

    course_details = {
        "id": str(course["_id"]),
        "name": course["name"],
        "description": course["description"],
        "teacher": teacher_info,
        "sections": course_sections,
        "students": student_list,
        "color": course.get("color", "rgba(0, 0, 0, 0.05)")
    }

    return jsonify({"course": course_details}), 200

@app.route('/section/<section_id>', methods=['GET'])
def get_section(section_id):
    section = sections.find_one({"_id": ObjectId(section_id)})

    if not section:
        return jsonify({"error": "Section not found"}), 404

    section_details = {
        "id": str(section["_id"]),
        "name": section["name"],
        "files": section["data"]
    }

    return jsonify({"section": section_details}), 200

@app.route('/user/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user_obj_id = ObjectId(user_id)

        user = users.find_one({"_id": user_obj_id})

        if not user:
            return jsonify({"error": "User not found"}), 404

        birth_date = None
        if "birth" in user and user["birth"]:
            birth_date = user["birth"].isoformat()

        user_data = {
            "id": str(user["_id"]),
            "name": user.get("name", ""),
            "surname": user.get("surname", ""),
            "email": user.get("email", ""),
            "role": user.get("role", ""),
            "sex": user.get("sex", ""),
            "birth": birth_date,
            "courses": [str(course_id) for course_id in user.get("courses", [])]
        }

        return jsonify({"user": user_data}), 200
    except Exception as e:
        print(f"Error in get_user: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/update_user/<user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        data = request.json

        user = users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404

        update_data = {}
        if "name" in data:
            update_data["name"] = data["name"]
        if "surname" in data:
            update_data["surname"] = data["surname"]
        if "email" in data:
            update_data["email"] = data["email"]
        if "sex" in data:
            update_data["sex"] = data["sex"]
        if "birth" in data and data["birth"]:
            try:
                update_data["birth"] = datetime.datetime.strptime(data["birth"], "%Y-%m-%d")
            except ValueError:
                return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

        if update_data:
            users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )

        return jsonify({"message": "User updated successfully"}), 200
    except Exception as e:
        print(f"Error in update_user: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/courses', methods=['GET'])
def get_courses():
    all_courses = courses.find({})

    course_list = []
    for course in all_courses:
        teacher = users.find_one({"_id": course["teacher"]})
        teacher_name = f"{teacher['name']} {teacher['surname']}" if teacher else "Unknown"

        course_list.append({
            "id": str(course["_id"]),
            "name": course["name"],
            "description": course["description"],
            "teacher": {"id": str(course["teacher"]), "name": teacher_name},
            "sections": [str(section_id) for section_id in course["sections"]],
            "students": [str(student_id) for student_id in course["students"]],
            "color": course.get("color", "rgba(0, 0, 0, 0.05)")
        })

    return jsonify({"courses": course_list}), 200

@app.route('/sections', methods=['GET'])
def get_sections():
    all_sections = sections.find({})

    section_list = []
    for section in all_sections:
        section_list.append({
            "id": str(section["_id"]),
            "name": section["name"],
            "data": section["data"]
        })

    return jsonify({"sections": section_list}), 200

@app.route('/update_course/<course_id>', methods=['PUT'])
def update_course(course_id):
    try:
        data = request.json

        course = courses.find_one({"_id": ObjectId(course_id)})
        if not course:
            return jsonify({"error": "Course not found"}), 404

        update_data = {}
        if "name" in data:
            update_data["name"] = data["name"]
        if "description" in data:
            update_data["description"] = data["description"]
        if "color" in data:
            update_data["color"] = data["color"]

        if update_data:
            courses.update_one(
                {"_id": ObjectId(course_id)},
                {"$set": update_data}
            )

        return jsonify({"message": "Course updated successfully"}), 200
    except Exception as e:
        print(f"Error in update_course: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
