import React, { useState } from "react";
import styles from "../styles/home.module.css";
import Course from "./Course";
import Calendar from 'react-calendar';

import 'react-calendar/dist/Calendar.css';

export default function Home() {
    const [date, setDate] = useState(new Date());

    const onChange = newDate => {
        setDate(newDate);
    };

    return (
        <div className={styles.body}>
            <div className={styles.header}>
                <img className={styles.logo_ameti} src="/assets/logo_ameti.jpeg" />
            </div>
            <div id={styles.header1}>
                <h3>
                    Corsi visitati di recente
                </h3>
            </div>
            <div className={styles.home_body}>
                <Course
                    name="M320"
                    description="Programmazione orientata a oggetti"
                    teachers={["Davide Krähenbühl"]}
                    students={16}
                    sections={["Basics", "Variables", "Functions", "Objects"]}
                    color={"rgba(0, 170, 255, 0.11)"}
                />
                <Course
                    name="M293"
                    description="Creare e pubblicare una pagina web"
                    teachers={["Gionata Genazzi"]}
                    students={8}
                    sections={["Basics", "Variables", "Functions", "Objects"]}
                    color={"rgba(120, 255, 0, 0.11)"}
                />
                <Course
                    name="M426"
                    description="Sviluppare software con metodi agili"
                    teachers={["Gionata Genazzi"]}
                    students={8}
                    sections={["Basics", "Variables", "Functions", "Objects"]}
                    color={"rgba(255, 189, 0, 0.11)"}
                />
                <Course
                    name="M165"
                    description="Utilizzare banche dati NoSQL"
                    teachers={["Simone Debortoli"]}
                    students={8}
                    sections={["Basics", "Variables", "Functions", "Objects"]}
                    color={"rgba(166, 0, 255, 0.11)"}
                />
                <Course
                    name="322"
                    description="Sviluppare interfacce grafiche"
                    teachers={["Davide Krähenbühl"]}
                    students={8}
                    sections={["Basics", "Variables", "Functions", "Objects"]}
                    color={"rgba(255, 0, 0, 0.11)"}
                />
            </div>
            <div className={styles.calendar}>
                <h3>Calendario</h3>
                <Calendar
                    onChange={onChange}
                    value={date}
                />
            </div>
        </div>
    );
}
