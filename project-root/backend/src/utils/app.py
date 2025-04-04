import os
from datetime import datetime
from functools import wraps
from bson import ObjectId
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
import bcrypt

UPLOAD_FOLDER, ALLOWED_EXTENSIONS = 'uploads/', {'docx', 'pptx', 'pdf', 'txt', 'py', 'js', 'html', 'css'}
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.config.update(UPLOAD_FOLDER=UPLOAD_FOLDER, MAX_CONTENT_LENGTH=16*1024*1024)
client = MongoClient("mongodb://localhost:27017")
db = client["Moodle-Bodio"]
users, courses, sections = db["users"], db["courses"], db["sections"]
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename): return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
def handle_exceptions(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        try: return f(*args, **kwargs)
        except Exception as e: return jsonify({"error": str(e)}), 500
    return decorated
def parse_date(date_str):
    if not date_str: return None
    try: return datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError: return None
def format_user(user):
    birth = user.get("birth")
    return {"id": str(user["_id"]), "name": user.get("name", ""), "surname": user.get("surname", ""),
            "email": user.get("email", ""), "role": user.get("role", ""), "sex": user.get("sex", ""),
            "birth": birth.isoformat() if birth else None, "courses": [str(c) for c in user.get("courses", [])]}
def format_course(course, details=False):
    result = {"id": str(course["_id"]), "name": course["name"], "description": course["description"],
              "color": course.get("color", "rgba(0, 0, 0, 0.05)")}
    if details:
        teacher = users.find_one({"_id": course["teacher"]})
        result["teacher"] = {"id": str(teacher["_id"]), "name": f"{teacher['name']} {teacher['surname']}"} if teacher else None
        result["sections"] = []
        for s_id in course["sections"]:
            s = sections.find_one({"_id": s_id})
            if s: result["sections"].append({"id": str(s["_id"]), "name": s["name"], "files": s["data"]})
        result["students"] = []
        for s_id in course["students"]:
            s = users.find_one({"_id": s_id})
            if s: result["students"].append({"id": str(s["_id"]), "name": f"{s['name']} {s['surname']}",
                                             "email": s["email"], "gender": s.get("sex", "male")})
    return result

@app.route('/uploads/<filename>')
def uploaded_file(filename): return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/register', methods=['POST'])
@handle_exceptions
def register_user():
    data = request.json
    if users.find_one({"email": data["email"]}): return jsonify({"error": "Email already registered"}), 400
    new_user = {"name": data["name"], "surname": data["surname"], "sex": data.get("sex", ""),
                "birth": parse_date(data.get("birth")), "email": data["email"],
                "password_hash": generate_password_hash(data["password"]), "role": data["role"], "courses": []}
    return jsonify({"message": "User registered successfully", "user_id": str(users.insert_one(new_user).inserted_id)}), 201


@app.route('/login', methods=['POST'])
@handle_exceptions
def login():
    data = request.json
    user = users.find_one({"email": data["email"]})
    if not user: return jsonify({"error": "User not found"}), 404
    if bcrypt.checkpw(data["password"].encode('utf-8'), user["password_hash"].encode('utf-8')):
        return jsonify({
            "message": "Login successful",
            "user_id": str(user["_id"]),
            "name": user["name"],
            "role": user["role"]
        }), 200
    else: return jsonify({"error": "Invalid password"}), 401


@app.route('/add_course', methods=['POST'])
@handle_exceptions
def add_course():
    data, teacher_id = request.json, ObjectId(request.json["teacher_id"])
    if not users.find_one({"_id": teacher_id, "role": "teacher"}): return jsonify({"error": "Teacher not found"}), 404
    new_course = {"name": data["name"], "description": data["description"], "teacher": teacher_id,
                  "sections": [], "students": [], "color": data.get("color", "rgba(0, 0, 0, 0.05)")}
    course_id = courses.insert_one(new_course).inserted_id
    users.update_one({"_id": teacher_id}, {"$push": {"courses": course_id}})
    return jsonify({"message": "Course added successfully", "course_id": str(course_id)}), 201

@app.route('/add_section', methods=['POST'])
@handle_exceptions
def add_section():
    data, course_id = request.json, ObjectId(request.json["course_id"])
    if not courses.find_one({"_id": course_id}): return jsonify({"error": "Course not found"}), 404
    section_id = sections.insert_one({"name": data["name"], "data": []}).inserted_id
    courses.update_one({"_id": course_id}, {"$push": {"sections": section_id}})
    return jsonify({"message": "Section added successfully", "section_id": str(section_id)}), 201

@app.route('/upload_file', methods=['POST'])
@handle_exceptions
def upload_file():
    if 'file' not in request.files or request.files['file'].filename == '':
        return jsonify({"error": "No file provided"}), 400
    file, section_id = request.files['file'], ObjectId(request.form.get('section_id'))
    if not sections.find_one({"_id": section_id}): return jsonify({"error": "Section not found"}), 404
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        file_url = f"http://127.0.0.1:5000/uploads/{filename}"
        sections.update_one({"_id": section_id}, {"$push": {"data": {"name": filename, "url": file_url}}})
        return jsonify({"message": "File uploaded successfully", "file_url": file_url}), 200
    return jsonify({"error": "Invalid file type"}), 400

@app.route('/enroll_student', methods=['POST'])
@handle_exceptions
def enroll_student():
    data = request.json
    student_id, course_id = ObjectId(data["student_id"]), ObjectId(data["course_id"])
    student, course = users.find_one({"_id": student_id, "role": "student"}), courses.find_one({"_id": course_id})
    if not student or not course:
        return jsonify({"error": f"{'Student' if not student else 'Course'} not found"}), 404
    if student_id in course["students"]: return jsonify({"message": "Student already enrolled in this course"}), 200
    courses.update_one({"_id": course_id}, {"$push": {"students": student_id}})
    users.update_one({"_id": student_id}, {"$push": {"courses": course_id}})
    return jsonify({"message": "Student enrolled successfully"}), 200

@app.route('/student_courses/<student_id>', methods=['GET'])
@handle_exceptions
def show_student_courses(student_id):
    student = users.find_one({"_id": ObjectId(student_id)})
    if not student: return jsonify({"error": "Student not found"}), 404
    return jsonify({"courses": [format_course(c) for c in courses.find({"_id": {"$in": student.get("courses", [])}})]}), 200

@app.route('/course/<course_id>', methods=['GET'])
@handle_exceptions
def get_course(course_id):
    course = courses.find_one({"_id": ObjectId(course_id)})
    if not course: return jsonify({"error": "Course not found"}), 404
    return jsonify({"course": format_course(course, True)}), 200

@app.route('/section/<section_id>', methods=['GET'])
@handle_exceptions
def get_section(section_id):
    section = sections.find_one({"_id": ObjectId(section_id)})
    if not section: return jsonify({"error": "Section not found"}), 404
    return jsonify({"section": {"id": str(section["_id"]), "name": section["name"], "files": section["data"]}}), 200

@app.route('/user/<user_id>', methods=['GET'])
@handle_exceptions
def get_user(user_id):
    user = users.find_one({"_id": ObjectId(user_id)})
    if not user: return jsonify({"error": "User not found"}), 404
    return jsonify({"user": format_user(user)}), 200

@app.route('/user_by_email/<email>', methods=['GET'])
@handle_exceptions
def get_user_by_email(email):
    user = users.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"user": format_user(user)}), 200

@app.route('/update_user/<user_id>', methods=['PUT'])
@handle_exceptions
def update_user(user_id):
    data, user_id_obj = request.json, ObjectId(user_id)
    if not users.find_one({"_id": user_id_obj}): return jsonify({"error": "User not found"}), 404
    update_data = {k: v for k, v in data.items() if k in ["name", "surname", "email", "sex"]}
    if "birth" in data and data["birth"]:
        birth_date = parse_date(data["birth"])
        if not birth_date: return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400
        update_data["birth"] = birth_date
    if update_data: users.update_one({"_id": user_id_obj}, {"$set": update_data})
    return jsonify({"message": "User updated successfully"}), 200

@app.route('/courses', methods=['GET'])
@handle_exceptions
def get_courses():
    result = []
    for c in courses.find({}):
        t = users.find_one({"_id": c["teacher"]})
        result.append({"id": str(c["_id"]), "name": c["name"], "description": c["description"],
                       "teacher": {"id": str(c["teacher"]), "name": f"{t['name']} {t['surname']}" if t else "Unknown"},
                       "sections": [str(s) for s in c["sections"]], "students": [str(s) for s in c["students"]],
                       "color": c.get("color", "rgba(0, 0, 0, 0.05)")})
    return jsonify({"courses": result}), 200

@app.route('/sections', methods=['GET'])
@handle_exceptions
def get_sections():
    return jsonify({"sections": [{"id": str(s["_id"]), "name": s["name"], "data": s["data"]} for s in sections.find({})]}), 200

@app.route('/delete_course/<course_id>', methods=['DELETE'])
@handle_exceptions
def delete_course(course_id):
    course_id_obj = ObjectId(course_id)
    course = courses.find_one({"_id": course_id_obj})
    if not course:return jsonify({"error": "Course not found"}), 404
    for student_id in course["students"]:
        users.update_one(
            {"_id": student_id},
            {"$pull": {"courses": course_id_obj}}
        )
    users.update_one(
        {"_id": course["teacher"]},
        {"$pull": {"courses": course_id_obj}}
    )
    for section_id in course["sections"]:sections.delete_one({"_id": section_id})
    courses.delete_one({"_id": course_id_obj})
    return jsonify({"message": "Course deleted successfully"}), 200


@app.route('/update_course/<course_id>', methods=['PUT'])
@handle_exceptions
def update_course(course_id):
    data, course_id_obj = request.json, ObjectId(course_id)
    if not courses.find_one({"_id": course_id_obj}): return jsonify({"error": "Course not found"}), 404
    update_data = {k: v for k, v in data.items() if k in ["name", "description", "color"]}
    if update_data: courses.update_one({"_id": course_id_obj}, {"$set": update_data})
    return jsonify({"message": "Course updated successfully"}), 200

if __name__ == '__main__': app.run(debug=True)
