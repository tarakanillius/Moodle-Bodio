import React from "react";
import style from "../styles/home.css";

const Home = () => {
    return (
        <div className="body">
            <div className="container">
                <img src="/assets/Antracite.jpeg"/>
                <div className="content">
                    <h3>Modulo 320</h3>
                    <p>Programmare in base a un modello orientato agli oggetti</p>
                </div>
            </div>
            <div className="container">
                <img src="/assets/Vetro_vulcanico.jpeg"/>
                <div className="content">
                    <h3>Modulo 322</h3>
                    <p>Sviluppare e implementare interfacce grafiche</p>
                </div>
            </div>
            <div className="container">
                <img src="/assets/Quercia.jpeg"/>
                <div className="content">
                    <h3>Modulo 165</h3>
                    <p>Utilizzare banche dati NoSQL</p>
                </div>
            </div>
            <div className="container">
                <img src="/assets/Sabbia.jpeg"/>
                <div className="content">
                    <h3>Modulo 426</h3>
                    <p>Sviluppare software con metodi agili</p>
                </div>
            </div>
            <div className="container">
                <img src="/assets/Tortora.jpeg"/>
                <div className="content">
                    <h3>Modulo 293</h3>
                    <p>Creare e pubblicare una pagina web</p>
                </div>
            </div>
        </div>
    );
};

export default Home;