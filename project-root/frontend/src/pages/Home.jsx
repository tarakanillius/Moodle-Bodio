import React from "react";
import styles from "../styles/home.module.css";
import SubjectContainer from "../components/SubjectContainer.jsx";

export default function Home() {
    return (
        <div className={styles.body}>
            <div className={styles.header}>
                <img className={styles.logo_ameti} src="/assets/logo_ameti.jpeg"/>
            </div>
            <div id={styles.header1}>
                <h3>
                    Corsi visitati di recente
                </h3>
            </div>
            <div className={styles.home_body}>
                <SubjectContainer image={"/assets/Antracite.jpeg"} schoolSubject={"Modulo 320"} description={"Programmare in base a un modello orientato agli oggetti"}/>
                <SubjectContainer image={"/assets/Vetro_vulcanico.jpeg"} schoolSubject={"Modulo 322"} description={"Sviluppare e implementare interfacce grafiche"}/>
                <SubjectContainer image={"/assets/Quercia.jpeg"} schoolSubject={"Modulo 165"} description={"Utilizzare banche dati NoSQL"}/>
                <SubjectContainer image={"/assets/Sabbia.jpeg"} schoolSubject={"Modulo 426"} description={"Sviluppare software con metodi agili"}/>
                <SubjectContainer image={"/assets/Tortora.jpeg"} schoolSubject={"Modulo 293"} description={"Creare e pubblicare una pagina web"}/>
            </div>
        </div>
    );
}
