import React, { useState, useRef, useContext } from 'react';
import { FaUpload, FaFile } from 'react-icons/fa';
import Modal from "../Modal";
import styles from "../../styles/modal.module.css";
import { GlobalContext } from "../../context/GlobalContext";

export default function UploadFileModal({ isOpen, onClose, onSubmit, isSubmitting }) {
    const { backgroundColor2, textColor } = useContext(GlobalContext);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!selectedFile) {
            setError('Please select a file to upload');
            return;
        }

        try {
            await onSubmit(selectedFile, (progress) => {
                setUploadProgress(progress);
            });
            setSelectedFile(null);
            setUploadProgress(0);
        } catch (error) {
            setError(error.message || "Failed to upload file");
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        setError('');
        setUploadProgress(0);
        onClose();
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedFile(e.dataTransfer.files[0]);
            setError('');
        }
    };

    const labelStyle = {
        color: textColor
    };

    const fileUploadAreaStyle = {
        backgroundColor: backgroundColor2,
        borderColor: textColor === '#ffffff' ? '#444' : '#e2e8f0',
        color: textColor
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Upload File"
        >
            <form onSubmit={handleSubmit} className={styles.modalForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="file" style={labelStyle}>Select File</label>
                    <div
                        className={styles.fileUploadArea}
                        onClick={() => fileInputRef.current.click()}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        style={fileUploadAreaStyle}
                    >
                        <input
                            type="file"
                            id="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <div className={styles.fileUploadContent}>
                            {selectedFile ? (
                                <div className={styles.selectedFileInfo} style={{ color: textColor }}>
                                    <FaFile />
                                    <span>{selectedFile.name}</span>
                                </div>
                            ) : (
                                <div className={styles.uploadPrompt} style={{ color: textColor }}>
                                    <FaUpload />
                                    <span>Click to select a file or drag and drop</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {uploadProgress > 0 && (
                    <div>
                        <div className={styles.progressContainer}>
                            <div
                                className={styles.progressBar}
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                        <div className={styles.progressText} style={{ color: textColor }}>
                            {uploadProgress}% uploaded
                        </div>
                    </div>
                )}

                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}

                <div className={styles.buttonGroup}>
                    <button
                        type="button"
                        className={`${styles.button} ${styles.secondaryButton}`}
                        onClick={handleClose}
                        style={{
                            backgroundColor: backgroundColor2,
                            color: textColor
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={`${styles.button} ${styles.primaryButton}`}
                        disabled={isSubmitting || !selectedFile}
                    >
                        {isSubmitting ? "Uploading..." : "Upload File"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

