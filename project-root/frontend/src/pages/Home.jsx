import React from "react";
import "../styles/home.css";
import SubjectContainer from "../components/SubjectContainer.jsx";

const Home = () => {
    return (
        <div className="body">
            <SubjectContainer image={"/assets/Antracite.jpeg"} schoolSubject={"Modulo 320"} description={"Programmare in base a un modello orientato agli oggetti"}/>
            <SubjectContainer image={"/assets/Vetro_vulcanico.jpeg"} schoolSubject={"Modulo 322"} description={"Sviluppare e implementare interfacce grafiche"}/>
            <SubjectContainer image={"/assets/Quercia.jpeg"} schoolSubject={"Modulo 165"} description={"Utilizzare banche dati NoSQL"}/>
            <SubjectContainer image={"/assets/Sabbia.jpeg"} schoolSubject={"Modulo 426"} description={"Sviluppare software con metodi agili"}/>
            <SubjectContainer image={"/assets/Tortora.jpeg"} schoolSubject={"Modulo 293"} description={"Creare e pubblicare una pagina web"}/>
        </div>
    );
};

export default Home;