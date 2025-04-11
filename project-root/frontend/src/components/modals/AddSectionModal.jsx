import React, { useState, useContext } from 'react';
import Modal from "../Modal";
import styles from "../../styles/modal.module.css";
import { GlobalContext } from "../../context/GlobalContext";

export default function AddSectionModal({ isOpen, onClose, onSubmit, isSubmitting }) {
    const { backgroundColor2, textColor } = useContext(GlobalContext);
    const [sectionName, setSectionName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!sectionName.trim()) {
            setError('Section name is required');
            return;
        }

        try {
            await onSubmit(sectionName);
            setSectionName('');
        } catch (error) {
            setError(error.message || "Failed to add section");
        }
    };

    const handleClose = () => {
        setSectionName('');
        setError('');
        onClose();
    };

    const inputStyle = {
        backgroundColor: backgroundColor2,
        color: textColor,
        borderColor: textColor === '#ffffff' ? '#444' : '#e2e8f0'
    };

    const labelStyle = {
        color: textColor
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add New Section"
        >
            <form onSubmit={handleSubmit} className={styles.modalForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="sectionName" style={labelStyle}>Section Name</label>
                    <input
                        type="text"
                        id="sectionName"
                        value={sectionName}
                        onChange={(e) => setSectionName(e.target.value)}
                        className={styles.input}
                        placeholder="Enter section name"
                        required
                        style={inputStyle}
                    />
                </div>

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
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Adding..." : "Add Section"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
