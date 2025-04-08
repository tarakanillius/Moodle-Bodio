import React, {useState, useContext} from 'react';
import { FaFile, FaEdit, FaTrash, FaPlus, FaCheck, FaRegCircle } from 'react-icons/fa';
import styles from "../../styles/courseDetail.module.css";
import modalStyles from "../../styles/modal.module.css";
import {GlobalContext} from "../../context/GlobalContext";
import Modal from "../Modal";
import axiosInstance from "../../utils/axiosConfig";

export default function SectionsTab({course, activeSection, setActiveSection, userRole, completedSections, toggleSectionCompletion}){
    const currentSection = course.sections.find(section => section.id === activeSection);
    const {theme, BACKEND_URL} = useContext(GlobalContext);
    const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
    const [newSectionName, setNewSectionName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleAddSection = async (e) => {
        e.preventDefault();
        if (!newSectionName.trim()) return;

        setIsSubmitting(true);
        setSubmitError('');

        try {
            const response = await axiosInstance.post(`${BACKEND_URL}/add_section`, {
                name: newSectionName,
                course_id: course.id
            });
            window.location.reload();
            setIsAddSectionModalOpen(false);
            setNewSectionName('');

        } catch (error) {
            console.error("Error adding section:", error);
            setSubmitError(error.response?.data?.error || "Failed to add section. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile || !activeSection) return;

        setIsSubmitting(true);
        setSubmitError('');

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('section_id', activeSection);

        try {
            const response = await axiosInstance.post(`${BACKEND_URL}/upload_file`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });

            // Refresh the course data to include the new file
            window.location.reload();

            setIsAddFileModalOpen(false);
            setSelectedFile(null);
            setUploadProgress(0);

        } catch (error) {
            console.error("Error uploading file:", error);
            setSubmitError(error.response?.data?.error || "Failed to upload file. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.courseContent} style={{ backgroundColor: theme === "Dark" ? "#000000" : "#ffffff" }}>
            <div className={styles.sectionsSidebar}>
                <h2 className={styles.sidebarTitle} style={{ color: theme === "Dark" ? "#ffffff" : "#000000" }}>Sections</h2>
                {userRole === "teacher" && (
                    <button
                        className={styles.addSectionButton}
                        onClick={() => setIsAddSectionModalOpen(true)}
                    >
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
                            <h2 className={styles.sectionTitle} style={{ color: theme === "Dark" ? "#ffffff" : "#000000" }}>{currentSection.name}</h2>
                            {userRole === "teacher" && (
                                <button
                                    className={styles.addFileButton}
                                    onClick={() => setIsAddFileModalOpen(true)}
                                >
                                    <FaPlus /> Add File
                                </button>
                            )}
                        </div>
                        <div className={styles.sectionFiles}>
                            <h3 className={styles.filesTitle} style={{ color: theme === "Dark" ? "#ffffff" : "#000000" }}>Files</h3>
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

            {/* Add Section Modal */}
            <Modal
                isOpen={isAddSectionModalOpen}
                onClose={() => setIsAddSectionModalOpen(false)}
                title="Add New Section"
                theme={theme}
            >
                <form onSubmit={handleAddSection}>
                    <div className={modalStyles.formGroup}>
                        <label htmlFor="sectionName">Section Name</label>
                        <input
                            type="text"
                            id="sectionName"
                            value={newSectionName}
                            onChange={(e) => setNewSectionName(e.target.value)}
                            placeholder="Enter section name"
                            required
                        />
                    </div>

                    {submitError && (
                        <div className={modalStyles.errorMessage}>
                            {submitError}
                        </div>
                    )}

                    <div className={modalStyles.buttonGroup}>
                        <button
                            type="button"
                            className={`${modalStyles.button} ${modalStyles.secondaryButton}`}
                            onClick={() => setIsAddSectionModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`${modalStyles.button} ${modalStyles.primaryButton}`}
                            disabled={isSubmitting || !newSectionName.trim()}
                        >
                            {isSubmitting ? "Adding..." : "Add Section"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Add File Modal */}
            <Modal
                isOpen={isAddFileModalOpen}
                onClose={() => setIsAddFileModalOpen(false)}
                title="Upload File"
                theme={theme}
            >
                <form onSubmit={handleFileUpload}>
                    <div className={modalStyles.formGroup}>
                        <label htmlFor="fileUpload">Select File</label>
                        <input
                            type="file"
                            id="fileUpload"
                            onChange={handleFileChange}
                            required
                        />
                        <small>Allowed file types: PDF, DOCX, PPTX, TXT, etc.</small>
                    </div>

                    {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className={modalStyles.progressContainer}>
                            <div
                                className={modalStyles.progressBar}
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                            <span className={modalStyles.progressText}>{uploadProgress}%</span>
                        </div>
                    )}

                    {submitError && (
                        <div className={modalStyles.errorMessage}>
                            {submitError}
                        </div>
                    )}

                    <div className={modalStyles.buttonGroup}>
                        <button
                            type="button"
                            className={`${modalStyles.button} ${modalStyles.secondaryButton}`}
                            onClick={() => setIsAddFileModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`${modalStyles.button} ${modalStyles.primaryButton}`}
                            disabled={isSubmitting || !selectedFile}
                        >
                            {isSubmitting ? "Uploading..." : "Upload File"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
