import { useState } from 'react';
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
                    viewMode={viewMode}
                    name="111"
                    description="Learn the basics of programming with this introductory course"
                    teachers={["Dr. Jane Smith", "Prof. John Doe", "Dr. Alan Turing"]}
                    students={123}
                    sections={["Basics", "Variables", "Functions", "Objects"]}
                />
                <Course
                    viewMode={viewMode}
                    name="311"
                    description="Master HTML, CSS, and JavaScript to build modern websites"
                    teachers={["Dr. Tim Berners-Lee", "Ada Lovelace"]}
                    students={87}
                    sections={["HTML", "CSS", "JavaScript", "React"]}
                />
                <Course
                    viewMode={viewMode}
                    name="202"
                    description="Learn to analyze and visualize data using Python"
                    teachers={["Dr. Grace Hopper", "Dr. Katherine Johnson"]}
                    students={65}
                    sections={["Python", "Pandas", "NumPy", "Visualization"]}
                />
                <Course
                    viewMode={viewMode}
                    name="204"
                    description="Build native mobile applications for iOS and Android"
                    teachers={["Steve Jobs", "Andy Rubin"]}
                    students={92}
                    sections={["Swift", "Kotlin", "React Native", "Flutter"]}
                />
                <Course
                    viewMode={viewMode}
                    name="501"
                    description="Explore machine learning and neural networks"
                    teachers={["Dr. Geoffrey Hinton", "Dr. Andrew Ng"]}
                    students={78}
                    sections={["ML Basics", "Neural Networks", "Deep Learning", "Applications"]}
                />
                <Course
                    viewMode={viewMode}
                    name="402"
                    description="Learn SQL and NoSQL database design and implementation"
                    teachers={["Dr. Edgar Codd", "Dr. Michael Stonebraker"]}
                    students={56}
                    sections={["SQL", "NoSQL", "Database Design", "Performance"]}
                />
                <Course
                    viewMode={viewMode}
                    name="205"
                    description="Understand threats and implement security measures"
                    teachers={["Bruce Schneier", "Dr. Whitfield Diffie"]}
                    students={45}
                    sections={["Network Security", "Cryptography", "Web Security", "Ethical Hacking"]}
                />
            </div>
        </div>
    );
}
