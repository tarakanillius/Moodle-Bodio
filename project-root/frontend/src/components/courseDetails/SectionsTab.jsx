import React, {useState, useContext} from 'react';
import { FaFile, FaEdit, FaTrash, FaPlus, FaCheck, FaRegCircle, FaFileAlt, FaBrain } from 'react-icons/fa';
import styles from "../../styles/courseDetail.module.css";
import modalStyles from "../../styles/modal.module.css";
import {GlobalContext} from "../../context/GlobalContext";
import Modal from "../Modal";
import Dropdown from "../Dropdown";
import axiosInstance from "../../utils/axiosConfig";

export default function SectionsTab({course, activeSection, setActiveSection, userRole, completedSections, toggleSectionCompletion}){
    const currentSection = course.sections.find(section => section.id === activeSection);
    const {backgroundColor, backgroundColor2, textColor, BACKEND_URL} = useContext(GlobalContext);
    const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
    const [newSectionName, setNewSectionName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [dropDownActive, setDropDownActive] = useState(false);

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

    const addContentItems = [
        {
            icon: <FaBrain />,
            label: "Add Quiz",
            onClick: () => {

            }
        },
        {
            icon: <FaFileAlt />,
            label: "Upload File",
            onClick: () => setIsAddFileModalOpen(true)
        }
    ];

    return (
        <div className={styles.courseContent} style={{ backgroundColor: backgroundColor }}>
            <div className={styles.sectionsSidebar}>
                <h2 className={styles.sidebarTitle} style={{ color: textColor }}>Sections</h2>
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
                                style={{color: textColor, backgroundColor: backgroundColor2}}
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
                        <div className={styles.sectionHeader} style={{
                            position: 'relative',
                            color: textColor
                        }}>
                            <h2 className={styles.sectionTitle}
                                style={{color: textColor}}>
                                {currentSection.name}
                            </h2>
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
                        <div className={styles.sectionData}>
                            <h3 className={styles.dataTitle}
                                style={{color: textColor}}>Content</h3>
                            {currentSection.files && currentSection.files.length > 0 ? (
                                <ul className={styles.filesList}>
                                    {currentSection.files.map((file, index) => (
                                        <li key={index} className={styles.fileItem}>
                                            <FaFile className={styles.fileIcon} style={{color: textColor}}/>
                                            <a href={file.url} target="_blank" rel="noopener noreferrer" className={styles.fileLink} style={{color: textColor}}>
                                                {file.name}
                                            </a>
                                            {userRole === "teacher" && (<FaTrash className={styles.deleteFileIcon}/>)}
                                        </li>
                                    ))}
                                </ul>
                            ) : (<p className={styles.noFiles}>No files in this section</p>)}
                        </div>
                    </>
                ) : (
                    <div className={styles.noSectionSelected}>
                        <p>Select a section to view its content</p>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isAddSectionModalOpen}
                onClose={() => setIsAddSectionModalOpen(false)}
                title="Add New Section"
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

            <Modal
                isOpen={isAddFileModalOpen}
                onClose={() => setIsAddFileModalOpen(false)}
                title="Upload File"
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
