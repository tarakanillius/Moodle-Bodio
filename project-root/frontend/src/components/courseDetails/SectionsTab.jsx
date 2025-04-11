import React, { useState, useContext, useEffect, useRef } from 'react';
import {
    FaFile, FaPlus, FaCheck, FaRegCircle, FaFileAlt,
    FaBrain, FaLink, FaDownload, FaExternalLinkAlt,
    FaChevronRight, FaEdit, FaEye, FaTrash
} from 'react-icons/fa';
import styles from "../../styles/courseDetail.module.css";
import modalStyles from "../../styles/modal.module.css";
import { GlobalContext } from "../../context/GlobalContext";
import Dropdown from "../Dropdown";
import AddSectionModal from "../modals/AddSectionModal";
import UploadFileModal from "../modals/UploadFileModal";
import AddQuizModal from "../modals/AddQuizModal";
import AddLinkModal from "../modals/AddLinkModal";
import QuizEditor from "../QuizEditor";
import QuizTaker from "../QuizTaker";
import {
    addSection,
    uploadFile,
    addQuiz,
    addLink,
    deleteLink,
    deleteFile
} from '../../handlers/sectionHandlers';
import { fetchQuiz, deleteQuiz } from '../../handlers/quizHandlers';

export default function SectionsTab({
                                        course,
                                        activeSection,
                                        setActiveSection,
                                        userRole,
                                        completedSections,
                                        toggleSectionCompletion,
                                        onCourseUpdated
                                    }) {
    const currentSection = course?.sections?.find(section => section.id === activeSection);
    const { backgroundColor, backgroundColor2, textColor, BACKEND_URL } = useContext(GlobalContext);
    const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
    const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
    const [isAddQuizModalOpen, setIsAddQuizModalOpen] = useState(false);
    const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
    const [isQuizTakerModalOpen, setIsQuizTakerModalOpen] = useState(false);
    const [isQuizEditorOpen, setIsQuizEditorOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dropDownActive, setDropDownActive] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [quizToEdit, setQuizToEdit] = useState(null);
    const [quizDetails, setQuizDetails] = useState({});
    const [loadingQuizzes, setLoadingQuizzes] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropDownActive(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    useEffect(() => {
        async function fetchQuizDetails() {
            if (currentSection && currentSection.quizzes && currentSection.quizzes.length > 0) {
                setLoadingQuizzes(true);

                const quizIds = currentSection.quizzes.map(quiz =>
                    typeof quiz === 'string' ? quiz : quiz.id
                );

                for (const quizId of quizIds) {
                    try {
                        const result = await fetchQuiz(BACKEND_URL, quizId);
                        if (result.success) {
                            setQuizDetails(prev => ({
                                ...prev,
                                [quizId]: {
                                    id: quizId,
                                    title: result.quiz.title,
                                    description: result.quiz.description,
                                    timeLimit: result.quiz.timeLimit
                                }
                            }));
                        }
                    } catch (error) {
                        console.error(`Error fetching quiz ${quizId}:`, error);
                    }
                }

                setLoadingQuizzes(false);
            }
        }

        fetchQuizDetails();
    }, [currentSection, BACKEND_URL]);

    const handleEditQuiz = (quizId) => {
        setQuizToEdit(quizId);
        setIsQuizEditorOpen(true);
    };

    const handleAddSection = async (sectionName) => {
        setIsSubmitting(true);

        try {
            const result = await addSection(BACKEND_URL, {
                name: sectionName,
                course_id: course.id
            });

            if (result.success) {
                const updatedCourse = {
                    ...course,
                    sections: [...(course.sections || []), {
                        id: result.data.section_id,
                        name: sectionName,
                        files: [],
                        links: [],
                        quizzes: []
                    }]
                };

                onCourseUpdated(updatedCourse);
                setIsAddSectionModalOpen(false);

                setActiveSection(result.data.section_id);
                return true;
            } else {
                throw new Error(result.error || "Failed to add section");
            }
        } catch (error) {
            console.error("Error adding section:", error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileUpload = async (file, onProgress) => {
        if (!activeSection) throw new Error("No section selected");

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('section_id', activeSection);

            const result = await uploadFile(BACKEND_URL, formData, onProgress);

            if (result.success) {
                const updatedSections = course.sections.map(section => {
                    if (section.id === activeSection) {
                        return {
                            ...section,
                            files: [...(section.files || []), {
                                id: result.data.file_id,
                                name: file.name,
                                url: result.data.file_url
                            }]
                        };
                    }
                    return section;
                });

                const updatedCourse = { ...course, sections: updatedSections };
                onCourseUpdated(updatedCourse);
                setIsAddFileModalOpen(false);
                return true;
            } else {
                throw new Error(result.error || "Failed to upload file");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddQuiz = async (quizData) => {
        if (!activeSection) throw new Error("No section selected");

        setIsSubmitting(true);

        try {
            const result = await addQuiz(BACKEND_URL, {
                ...quizData,
                section_id: activeSection
            });

            if (result.success) {
                const updatedSections = course.sections.map(section => {
                    if (section.id === activeSection) {
                        return {
                            ...section,
                            quizzes: [...(section.quizzes || []), {
                                id: result.data.quiz_id,
                                title: quizData.title,
                                description: quizData.description,
                                timeLimit: quizData.timeLimit
                            }]
                        };
                    }
                    return section;
                });

                const updatedCourse = { ...course, sections: updatedSections };
                onCourseUpdated(updatedCourse);
                setIsAddQuizModalOpen(false);
                return true;
            } else {
                throw new Error(result.error || "Failed to add quiz");
            }
        } catch (error) {
            console.error("Error adding quiz:", error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddLink = async (linkData) => {
        if (!activeSection) throw new Error("No section selected");

        setIsSubmitting(true);

        try {
            const result = await addLink(BACKEND_URL, {
                ...linkData,
                section_id: activeSection
            });

            if (result.success) {
                const updatedSections = course.sections.map(section => {
                    if (section.id === activeSection) {
                        return {
                            ...section,
                            links: [...(section.links || []), {
                                id: result.data.link_id,
                                title: linkData.title,
                                url: linkData.url,
                                description: linkData.description
                            }]
                        };
                    }
                    return section;
                });

                const updatedCourse = { ...course, sections: updatedSections };
                onCourseUpdated(updatedCourse);
                setIsAddLinkModalOpen(false);
                return true;
            } else {
                throw new Error(result.error || "Failed to add link");
            }
        } catch (error) {
            console.error("Error adding link:", error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleQuizClick = (quizId) => {
        setSelectedQuizId(quizId);
        setIsQuizTakerModalOpen(true);
    };

    const handleDeleteQuiz = async (quizId) => {
        if (!window.confirm("Are you sure you want to delete this quiz?")) return;

        try {
            const quizExists = await fetchQuiz(BACKEND_URL, quizId);

            if (!quizExists.success) {
                console.log("Quiz not found in database, removing from UI only");

                const updatedSections = course.sections.map(section => {
                    if (section.id === activeSection) {
                        return {
                            ...section,
                            quizzes: section.quizzes.filter(quiz => {
                                const id = typeof quiz === 'string' ? quiz : quiz.id;
                                return id !== quizId;
                            })
                        };
                    }
                    return section;
                });

                const updatedCourse = { ...course, sections: updatedSections };
                onCourseUpdated(updatedCourse);

                setQuizDetails(prev => {
                    const newDetails = {...prev};
                    delete newDetails[quizId];
                    return newDetails;
                });

                return;
            }

            const result = await deleteQuiz(BACKEND_URL, quizId);

            if (result.success) {
                const updatedSections = course.sections.map(section => {
                    if (section.id === activeSection) {
                        return {
                            ...section,
                            quizzes: section.quizzes.filter(quiz => {
                                const id = typeof quiz === 'string' ? quiz : quiz.id;
                                return id !== quizId;
                            })
                        };
                    }
                    return section;
                });

                const updatedCourse = { ...course, sections: updatedSections };
                onCourseUpdated(updatedCourse);

                setQuizDetails(prev => {
                    const newDetails = {...prev};
                    delete newDetails[quizId];
                    return newDetails;
                });
            } else {
                alert("Failed to delete quiz: " + result.error);
            }
        } catch (error) {
            console.error("Error deleting quiz:", error);

            const updatedSections = course.sections.map(section => {
                if (section.id === activeSection) {
                    return {
                        ...section,
                        quizzes: section.quizzes.filter(quiz => {
                            const id = typeof quiz === 'string' ? quiz : quiz.id;
                            return id !== quizId;
                        })
                    };
                }
                return section;
            });

            const updatedCourse = { ...course, sections: updatedSections };
            onCourseUpdated(updatedCourse);

            alert("An error occurred, but the quiz was removed from the UI");
        }
    };

    const handleDeleteLink = async (linkId) => {
        if (!window.confirm("Are you sure you want to delete this link?")) return;

        try {
            if (!activeSection || !linkId) {
                throw new Error("Missing section ID or link ID");
            }

            const updatedSections = course.sections.map(section => {
                if (section.id === activeSection) {
                    return {
                        ...section,
                        links: section.links.filter(link => link.id !== linkId)
                    };
                }
                return section;
            });

            const updatedCourse = { ...course, sections: updatedSections };
            onCourseUpdated(updatedCourse);

            try {
                await deleteLink(BACKEND_URL, activeSection, linkId);
                console.log("Link deleted successfully");
            } catch (error) {
                console.warn("Server error deleting link, but UI was updated:", error);
            }
        } catch (error) {
            console.error("Error deleting link:", error);
            alert("An error occurred while trying to delete the link");
        }
    };

    const handleDeleteFile = async (fileId) => {
        if (!window.confirm("Are you sure you want to delete this file?")) return;

        try {
            if (!fileId) {
                throw new Error("Missing file ID");
            }

            const result = await deleteFile(BACKEND_URL, fileId);

            if (result.success) {
                const updatedSections = course.sections.map(section => {
                    if (section.id === activeSection) {
                        return {
                            ...section,
                            files: section.files.filter(file => file.id !== fileId)
                        };
                    }
                    return section;
                });

                const updatedCourse = { ...course, sections: updatedSections };
                onCourseUpdated(updatedCourse);
            } else {
                const updatedSections = course.sections.map(section => {
                    if (section.id === activeSection) {
                        return {
                            ...section,
                            files: section.files.filter(file => file.id !== fileId)
                        };
                    }
                    return section;
                });

                const updatedCourse = { ...course, sections: updatedSections };
                onCourseUpdated(updatedCourse);

                console.warn("Server error deleting file, but UI was updated:", result.error);
            }
        } catch (error) {
            console.error("Error deleting file:", error);

            const updatedSections = course.sections.map(section => {
                if (section.id === activeSection) {
                    return {
                        ...section,
                        files: section.files.filter(file => file.id !== fileId)
                    };
                }
                return section;
            });

            const updatedCourse = { ...course, sections: updatedSections };
            onCourseUpdated(updatedCourse);

            alert("An error occurred, but the file was removed from the UI");
        }
    };

    const addContentItems = [
        {
            icon: <FaBrain />,
            label: "Add Quiz",
            onClick: () => setIsAddQuizModalOpen(true)
        },
        {
            icon: <FaFileAlt />,
            label: "Upload File",
            onClick: () => setIsAddFileModalOpen(true)
        },
        {
            icon: <FaLink />,
            label: "Add Link",
            onClick: () => setIsAddLinkModalOpen(true)
        }
    ];

    const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();

        if (['pdf'].includes(extension)) return <FaFileAlt style={{ color: '#e74c3c' }} />;
        if (['doc', 'docx'].includes(extension)) return <FaFileAlt style={{ color: '#3498db' }} />;
        if (['xls', 'xlsx'].includes(extension)) return <FaFileAlt style={{ color: '#2ecc71' }} />;
        if (['ppt', 'pptx'].includes(extension)) return <FaFileAlt style={{ color: '#e67e22' }} />;
        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return <FaFileAlt style={{ color: '#9b59b6' }} />;
        if (['mp3', 'wav'].includes(extension)) return <FaFileAlt style={{ color: '#1abc9c' }} />;
        if (['mp4', 'avi', 'mov'].includes(extension)) return <FaFileAlt style={{ color: '#e84393' }} />;

        return <FaFile style={{ color: '#7f8c8d' }} />;
    };

    return (
        <div className={styles.courseContent}>
            <div className={styles.sectionsSidebar} style={{backgroundColor: backgroundColor2}}>
                <div className={styles.sidebarTitle} style={{color: textColor}}>
                    Course Sections
                </div>

                {userRole === 'teacher' && (
                    <button
                        className={styles.addSectionButton}
                        onClick={() => setIsAddSectionModalOpen(true)}
                    >
                        <FaPlus /> Add New Section
                    </button>
                )}

                <ul className={styles.sectionsList}>
                    {course?.sections?.length > 0 ? (
                        course.sections.map(section => (
                            <li
                                key={section.id}
                                className={`${styles.sectionItem} ${activeSection === section.id ? styles.activeSection : ''}`}
                                onClick={() => setActiveSection(section.id)}
                            >
                                <div className={styles.completionIndicator}>
                                    {userRole === 'student' && (
                                        <span onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSectionCompletion(section.id);
                                        }}>
                                            {completedSections.includes(section.id) ? (
                                                <FaCheck className={styles.completedIcon} />
                                            ) : (
                                                <FaRegCircle className={styles.incompleteIcon} />
                                            )}
                                        </span>
                                    )}
                                    {userRole === 'teacher' && <FaChevronRight />}
                                </div>
                                <span style={{color: textColor}} >{section.name}</span>
                            </li>
                        ))
                    ) : (
                        <li className={styles.noSections}>
                            <span style={{color: textColor}}>No sections available</span>
                        </li>
                    )}
                </ul>
            </div>

            <div className={styles.sectionContent} style={{backgroundColor: backgroundColor2}}>
                {currentSection ? (
                    <>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle} style={{color: textColor}}>{currentSection.name}</h2>

                            {userRole === "teacher" && (
                                <Dropdown
                                    trigger={
                                        <button className={styles.addFileButton}>
                                            <FaPlus/> Add Content
                                        </button>
                                    }
                                    isOpen={dropDownActive}
                                    setIsOpen={setDropDownActive}
                                    items={addContentItems}
                                    backgroundColor={backgroundColor2}
                                    borderColor={backgroundColor}
                                />
                            )}
                        </div>

                        <div className={styles.contentSections}>
                            {currentSection.files && currentSection.files.length > 0 && (
                                <div className={styles.contentBlock}>
                                    <h3 className={styles.filesTitle} style={{color: textColor}}>
                                        <FaFileAlt style={{ marginRight: '8px' }} /> Files
                                    </h3>
                                    <ul className={styles.filesList}>
                                        {currentSection.files.map(file => (
                                            <li key={file.id} className={styles.fileItem}>
                                                <div className={styles.fileIcon}>
                                                    {getFileIcon(file.name)}
                                                </div>
                                                <a
                                                    href={file.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={styles.fileLink}
                                                    style={{color: textColor}}
                                                >
                                                    {file.name}
                                                </a>
                                                <div className={styles.fileActions}>
                                                    <a
                                                        href={file.url}
                                                        download
                                                        className={styles.actionIcon}
                                                        title="Download file"
                                                    >
                                                        <FaDownload />
                                                    </a>
                                                    {userRole === 'teacher' && (
                                                        <span
                                                            className={`${styles.actionIcon} ${styles.deleteIcon}`}
                                                            title="Delete file"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteFile(file.id);
                                                            }}
                                                        >
                                                            <FaTrash />
                                                        </span>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {currentSection.links && currentSection.links.length > 0 && (
                                <div className={styles.contentBlock}>
                                    <h3 className={styles.filesTitle} style={{color: textColor}}>
                                        <FaLink style={{ marginRight: '8px' }} /> Links
                                    </h3>
                                    <ul className={styles.filesList}>
                                        {currentSection.links.map(link => (
                                            <li key={link.id} className={styles.fileItem}>
                                                <div className={styles.fileIcon}>
                                                    <FaLink style={{ color: '#3498db' }} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                <span
                                                    className={styles.fileLink}
                                                    style={{color: textColor, cursor: 'pointer'}}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        const newWindow = window.open();
                                                        if (newWindow) {
                                                            newWindow.opener = null;
                                                            newWindow.location = link.url;
                                                        }
                                                    }}
                                                >
                                                    {link.title}
                                                </span>
                                                    {link.description && (
                                                        <p style={{color: textColor, margin: '4px 0 0', fontSize: '14px'}}>
                                                            {link.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className={styles.linkActions}>
                                                    <span
                                                        className={styles.actionIcon}
                                                        title="Open in new tab"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const newWindow = window.open();
                                                            if (newWindow) {
                                                                newWindow.opener = null;
                                                                newWindow.location = link.url;
                                                            }
                                                        }}
                                                    >
                                                        <FaExternalLinkAlt />
                                                    </span>
                                                    {userRole === 'teacher' && (
                                                        <span
                                                            className={`${styles.actionIcon} ${styles.deleteIcon}`}
                                                            title="Delete link"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteLink(link.id);
                                                            }}
                                                        >
                                                            <FaTrash />
                                                        </span>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {currentSection.quizzes && currentSection.quizzes.length > 0 && (
                                <div className={styles.contentBlock}>
                                    <h3 className={styles.filesTitle} style={{color: textColor}}>
                                        <FaBrain style={{ marginRight: '8px' }} /> Quizzes
                                    </h3>
                                    <ul className={styles.filesList}>
                                        {currentSection.quizzes.map(quiz => {
                                            const quizId = typeof quiz === 'string' ? quiz : quiz.id;
                                            const quizDetail = quizDetails[quizId] || {};
                                            const quizTitle = quizDetail.title || quiz.title || "Untitled Quiz";
                                            const quizDescription = quizDetail.description || quiz.description || "";
                                            const quizTimeLimit = quizDetail.timeLimit || quiz.timeLimit || "N/A";

                                            return (
                                                <li
                                                    key={quizId}
                                                    className={styles.fileItem}
                                                >
                                                    <div className={styles.fileIcon}>
                                                        <FaBrain style={{ color: '#9b59b6' }} />
                                                    </div>
                                                    <div
                                                        style={{ flex: 1, cursor: 'pointer' }}
                                                        onClick={() => userRole === 'teacher' ? handleEditQuiz(quizId) : handleQuizClick(quizId)}
                                                    >
                                                        <span className={styles.fileLink} style={{color: textColor}}>
                                                            {quizTitle}
                                                        </span>
                                                        {quizDescription && (
                                                            <p style={{color: textColor, margin: '4px 0 0', fontSize: '14px'}}>
                                                                {quizDescription}
                                                            </p>
                                                        )}
                                                        <div style={{fontSize: '13px', color: '#718096', marginTop: '4px'}}>
                                                            Time limit: {quizTimeLimit} minutes
                                                        </div>
                                                    </div>
                                                    {userRole === 'teacher' ? (
                                                        <div className={styles.quizActions}>
                                                            <button
                                                                className={styles.editButton}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEditQuiz(quizId);
                                                                }}
                                                                title="Edit Quiz"
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                            <button
                                                                className={styles.previewButton}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleQuizClick(quizId);
                                                                }}
                                                                title="Preview Quiz"
                                                            >
                                                                <FaEye />
                                                            </button>
                                                            <button
                                                                className={styles.deleteButton}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteQuiz(quizId);
                                                                }}
                                                                title="Delete Quiz"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className={styles.deleteFileIcon} onClick={() => handleQuizClick(quizId)}>
                                                            <FaChevronRight />
                                                        </div>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}

                            {(!currentSection.files || currentSection.files.length === 0) &&
                                (!currentSection.links || currentSection.links.length === 0) &&
                                (!currentSection.quizzes || currentSection.quizzes.length === 0) && (
                                    <div className={styles.noSectionSelected} style={{marginTop: '40px'}}>
                                        <div style={{textAlign: 'center'}}>
                                            <FaFileAlt style={{fontSize: '48px', color: '#a0aec0', marginBottom: '16px'}} />
                                            <p style={{color: textColor, fontSize: '18px', marginBottom: '16px'}}>
                                                No content in this section yet
                                            </p>
                                        </div>
                                    </div>
                                )}
                        </div>
                    </>
                ) : (
                    <div className={styles.noSectionSelected}>
                        <div style={{textAlign: 'center'}}>
                            <FaFileAlt style={{fontSize: '48px', color: '#a0aec0', marginBottom: '16px'}} />
                            <p style={{color: textColor, fontSize: '18px'}}>
                                Select a section to view its content
                            </p>
                            {course?.sections?.length === 0 && userRole === 'teacher' && (
                                <button
                                    className={styles.addFileButton}
                                    style={{marginTop: '16px'}}
                                    onClick={() => setIsAddSectionModalOpen(true)}
                                >
                                    <FaPlus /> Create First Section
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <AddSectionModal
                isOpen={isAddSectionModalOpen}
                onClose={() => setIsAddSectionModalOpen(false)}
                onSubmit={handleAddSection}
                isSubmitting={isSubmitting}
            />

            <UploadFileModal
                isOpen={isAddFileModalOpen}
                onClose={() => setIsAddFileModalOpen(false)}
                onSubmit={handleFileUpload}
                isSubmitting={isSubmitting}
            />

            <AddQuizModal
                isOpen={isAddQuizModalOpen}
                onClose={() => setIsAddQuizModalOpen(false)}
                onSubmit={handleAddQuiz}
                isSubmitting={isSubmitting}
            />

            <AddLinkModal
                isOpen={isAddLinkModalOpen}
                onClose={() => setIsAddLinkModalOpen(false)}
                onSubmit={handleAddLink}
                isSubmitting={isSubmitting}
            />

            {isQuizTakerModalOpen && selectedQuizId && (
                <div className={modalStyles.modalOverlay}>
                    <div className={`${modalStyles.modalContent} ${modalStyles.fullWidthModal}`} style={{backgroundColor: backgroundColor}}>
                        <QuizTaker
                            quizId={selectedQuizId}
                            onClose={() => {
                                setIsQuizTakerModalOpen(false);
                                setSelectedQuizId(null);
                            }}
                        />
                    </div>
                </div>
            )}

            {isQuizEditorOpen && quizToEdit && (
                <div className={modalStyles.modalOverlay}>
                    <div className={`${modalStyles.modalContent} ${modalStyles.fullWidthModal}`}>
                        <QuizEditor
                            quizId={quizToEdit}
                            onClose={() => {
                                setIsQuizEditorOpen(false);
                                setQuizToEdit(null);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
