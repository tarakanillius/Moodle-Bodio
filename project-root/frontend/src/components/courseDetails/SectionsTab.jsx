import React from 'react';
import { FaFile, FaEdit, FaTrash, FaPlus, FaCheck, FaRegCircle } from 'react-icons/fa';
import styles from "../../styles/courseDetail.module.css";

export default function SectionsTab({
                         course,
                         activeSection,
                         setActiveSection,
                         userRole,
                         completedSections,
                         toggleSectionCompletion
                     }){
    const currentSection = course.sections.find(section => section.id === activeSection);

    return (
        <div className={styles.courseContent}>
            <div className={styles.sectionsSidebar}>
                <h2 className={styles.sidebarTitle}>Sections</h2>
                {userRole === "teacher" && (
                    <button className={styles.addSectionButton}>
                        <FaPlus /> Add Section
                    </button>
                )}
                <ul className={styles.sectionsList}>
                    {course.sections && course.sections.length > 0 ? (
                        course.sections.map(section => (
                            <li
                                key={section.id}
                                className={`${styles.sectionItem} ${section.id === activeSection ? styles.activeSection : ''}`}
                                onClick={() => setActiveSection(section.id)}
                            >
                                {userRole === "student" && (
                                    <span
                                        className={styles.completionIndicator}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSectionCompletion(section.id);
                                        }}
                                    >
                                        {completedSections.includes(section.id) ?
                                            <FaCheck className={styles.completedIcon} /> :
                                            <FaRegCircle className={styles.incompleteIcon} />
                                        }
                                    </span>
                                )}
                                {section.name}
                                {userRole === "teacher" && (
                                    <div className={styles.sectionActions}>
                                        <FaEdit className={styles.editIcon} />
                                        <FaTrash className={styles.deleteIcon} />
                                    </div>
                                )}
                            </li>
                        ))
                    ) : (
                        <li className={styles.noSections}>No sections available</li>
                    )}
                </ul>
            </div>

            <div className={styles.sectionContent}>
                {currentSection ? (
                    <>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>{currentSection.name}</h2>
                            {userRole === "teacher" && (
                                <button className={styles.addFileButton}>
                                    <FaPlus /> Add File
                                </button>
                            )}
                        </div>

                        <div className={styles.sectionFiles}>
                            <h3 className={styles.filesTitle}>Files</h3>
                            {currentSection.files && currentSection.files.length > 0 ? (
                                <ul className={styles.filesList}>
                                    {currentSection.files.map((file, index) => (
                                        <li key={index} className={styles.fileItem}>
                                            <FaFile className={styles.fileIcon} />
                                            <a
                                                href={file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.fileLink}
                                            >
                                                {file.name}
                                            </a>
                                            {userRole === "teacher" && (
                                                <FaTrash className={styles.deleteFileIcon} />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className={styles.noFiles}>No files in this section</p>
                            )}
                        </div>
                    </>
                ) : (
                    <div className={styles.noSectionSelected}>
                        <p>Select a section to view its content</p>
                    </div>
                )}
            </div>
        </div>
    );
};
