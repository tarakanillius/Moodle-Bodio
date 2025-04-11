export default function getAvatarImage(role, sex) {
    if (role === "teacher" && sex === "female") return "/assets/teacher-female.png";
    else if (role === "teacher" && sex === "male") return "/assets/teacher-male.png";
    else if (role === "student" && sex === "female") return "/assets/student-female.png";
    else if (role === "student" && sex === "male") return "/assets/student-male.png";
    return null;
};

