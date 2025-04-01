import React from "react";
import styles from "../styles/home.module.css";

export default function Sidebar({image, schoolSubject, description}) {
    return (
        <div className={styles.container}>
            <img src={image} alt={schoolSubject}/>
            <div className={styles.content}>
                <h3 className={styles.heading}>{schoolSubject}</h3>
                <p className={styles.paragraph}>{description}</p>
            </div>
        </div>
    );
};
