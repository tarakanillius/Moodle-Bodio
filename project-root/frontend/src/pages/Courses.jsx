import React, { useState } from 'react';
import { FaSearch, FaList, FaTh } from 'react-icons/fa';
import styles from "../styles/courses.module.css";
import Course from "./Course";

export default function Courses() {
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');

    const toggleViewMode = () => {
        setViewMode(viewMode === 'grid' ? 'list' : 'grid');
    };

    const handleSearch = () => {
        console.log('Searching for:', searchQuery);
    };

    return (
        <div className={styles.coursesContainer}>
            <div className={styles.searchBarContainer}>
                <div className={styles.searchInputWrapper}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <div className={styles.actionButtons}>
                    <button
                        className={styles.viewToggleBtn}
                        onClick={toggleViewMode}
                        title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
                    >
                        {viewMode === 'grid' ? <FaList /> : <FaTh />}
                    </button>
                    <button
                        className={styles.searchBtn}
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>
            </div>

            <div className={`${styles.coursesList} ${styles[viewMode]}`}>
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
        </div>
    );
}
