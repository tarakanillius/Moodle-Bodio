import React from "react";
import style from "../styles/home.css";

const Home = () => {
    return (
        <div className="body">
            <div className="container">
                <h1>Modulo 320</h1>
                <p>Programmare in base a un modello orientato agli oggetti</p>
            </div>
            <div className="container">
                <h1>Modulo 322</h1>
                <p>Sviluppare e implementare interfacce grafiche</p>
            </div>
            <div className="container">
                <h1>Modulo 165</h1>
                <p>Utilizzare banche dati NoSQL</p>
            </div>
            <div className="container">
                <h1>Modulo 426</h1>
                <p>Sviluppare software con metodi agili</p>
            </div>
            <div className="container">
                <h1>Modulo 293</h1>
                <p>Creare e pubblicare una pagina web</p>
            </div>
        </div>
    );
};

export default Home;
