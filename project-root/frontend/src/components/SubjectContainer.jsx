import React from "react";
import "../styles/home.css";

export default function Sidebar({image, schoolSubject, description}) {
    return (
        <div className="container">
            <img src={image}/>
            <div className="content">
                <h3>{schoolSubject}</h3>
                <p>{description}</p>
            </div>
        </div>
    );
};
