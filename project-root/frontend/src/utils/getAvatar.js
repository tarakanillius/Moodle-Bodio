export default function getAvatarImage(role, gender) {
    if (role === "teacher" && gender === "female") return "/assets/teacher-female.png";
    else if (role === "teacher" && gender === "male") return "/assets/teacher-male.png";
    else if (role === "student" && gender === "female") return "/assets/student-female.png";
    else if (role === "student" && gender === "male") return "/assets/student-male.png";
    return null;
};
