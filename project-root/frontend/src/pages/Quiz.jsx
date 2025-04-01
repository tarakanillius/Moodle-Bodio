import React from "react";
import "../styles/quiz.css";

const Login = () => {
    return (
        <body className="quiz_body">
        <div className="quiz_container">
            <h2>JavaScript Fundamentals - Module 2 Quiz</h2>
            <div className="quiz_question">
                <strong>Which statement correctly creates a variable in JavaScript?</strong>
            </div>
            <div className="quiz_options">
                <label><input type="radio" name="answer"/> var name = "John";</label>
                <label><input type="radio" name="answer"/> let name = "John";</label>
                <label><input type="radio" name="answer"/> const name = "John";</label>
                <label><input type="radio" name="answer"/> string name = "John";</label>
            </div>
            <div className="quiz_buttons">
                <button className="quiz_prev">Previous</button>
                <button className="quiz_next">Next Question</button>
            </div>
        </div>
        </body>
    );
};

export default Login;