import React from "react";
import styles from "../styles/quiz.module.css";

export default function Quiz() {
    return (
        <div className={styles.body}>
            <div className={styles.container}>
                <h2 className={styles.heading}>JavaScript Fundamentals - Module 2 Quiz</h2>
                <div className={styles.question}>
                    <strong>Which statement correctly creates a variable in JavaScript?</strong>
                </div>
                <div className={styles.options}>
                    <label><input type="radio" name="answer"/> var name = "John";</label>
                    <label><input type="radio" name="answer"/> let name = "John";</label>
                    <label><input type="radio" name="answer"/> const name = "John";</label>
                    <label><input type="radio" name="answer"/> string name = "John";</label>
                </div>
                <div className={styles.buttons}>
                    <button className={`${styles.button} ${styles.prev}`}>Previous</button>
                    <button className={`${styles.button} ${styles.next}`}>Next Question</button>
                </div>
            </div>
        </div>
    );
};
