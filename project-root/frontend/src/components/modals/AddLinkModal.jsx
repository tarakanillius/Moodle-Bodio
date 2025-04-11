import React, { useState, useContext } from 'react';
import Modal from "../Modal";
import styles from "../../styles/modal.module.css";
import { GlobalContext } from "../../context/GlobalContext";

export default function AddLinkModal({ isOpen, onClose, onSubmit, isSubmitting }) {
    const { backgroundColor2, textColor } = useContext(GlobalContext);

    const [linkData, setLinkData] = useState({
        title: '',
        url: '',
        description: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLinkData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!linkData.title.trim()) {
            setError('Link title is required');
            return;
        }

        if (!linkData.url.trim()) {
            setError('URL is required');
            return;
        }

        try {
            new URL(linkData.url);
        } catch (e) {
            setError('Please enter a valid URL (include http:// or https://)');
            return;
        }

        try {
            await onSubmit(linkData);
            setLinkData({
                title: '',
                url: '',
                description: ''
            });
        } catch (error) {
            setError(error.message || "Failed to add link");
        }
    };

    const handleClose = () => {
        setLinkData({
            title: '',
            url: '',
            description: ''
        });
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
            title="Add Link"
        >
            <form onSubmit={handleSubmit} className={styles.modalForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="title" style={labelStyle}>Link Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={linkData.title}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="Enter link title"
                        required
                        style={inputStyle}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="url" style={labelStyle}>URL</label>
                    <input
                        type="url"
                        id="url"
                        name="url"
                        value={linkData.url}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="https://example.com"
                        required
                        style={inputStyle}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="description" style={labelStyle}>Description (optional)</label>
                    <textarea
                        id="description"
                        name="description"
                        value={linkData.description}
                        onChange={handleChange}
                        className={styles.textarea}
                        placeholder="Enter link description"
                        rows={3}
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
                        {isSubmitting ? "Adding..." : "Add Link"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
