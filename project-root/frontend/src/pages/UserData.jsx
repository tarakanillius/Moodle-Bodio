import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { getUserDetails, updateUserProfile, clearUserFromContext } from '../handlers/userHandlers';
import { getCourseById } from '../handlers/courseHandlers';
import styles from '../styles/userData.module.css';
import getAvatarImage from '../utils/getAvatar';
import { useNavigate } from 'react-router-dom';

export default function UserData() {
    const { user, backgroundColor, backgroundColor2, textColor, BACKEND_URL, clearUser } = useContext(GlobalContext);
    const [userData, setUserData] = useState(null);
    const [userCourses, setUserCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [coursesLoading, setCoursesLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        bio: ''
    });
    const [updateStatus, setUpdateStatus] = useState({ success: false, message: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const result = await getUserDetails(BACKEND_URL, user.id);

                if (result.success) {
                    setUserData(result.user);
                    setFormData({
                        name: result.user.name || '',
                        surname: result.user.surname || '',
                        email: result.user.email || '',
                        bio: result.user.bio || ''
                    });

                    if (result.user.courses && result.user.courses.length > 0) {
                        fetchCourseDetails(result.user.courses);
                    }
                } else {
                    setError(result.error);
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("Failed to load user data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [BACKEND_URL, user.id]);

    const fetchCourseDetails = async (courseIds) => {
        try {
            setCoursesLoading(true);
            const coursePromises = courseIds.map(courseId =>
                getCourseById(BACKEND_URL, courseId)
            );

            const courseResults = await Promise.all(coursePromises);

            const coursesWithDetails = courseResults
                .filter(result => result.success)
                .map(result => result.course);

            setUserCourses(coursesWithDetails);
        } catch (err) {
            console.error("Error fetching course details:", err);
        } finally {
            setCoursesLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateStatus({ success: false, message: '' });

        try {
            const result = await updateUserProfile(BACKEND_URL, user.id, formData);

            if (result.success) {
                setUserData({
                    ...userData,
                    ...formData
                });
                setEditMode(false);
                setUpdateStatus({ success: true, message: 'Profile updated successfully!' });
            } else {
                setUpdateStatus({ success: false, message: result.error });
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            setUpdateStatus({ success: false, message: "Failed to update profile. Please try again." });
        }
    };

    const handleLogout = () => {
        clearUserFromContext();
        clearUser();
        navigate('/login');
    };

    if (loading) {
        return <div className={styles.loadingMessage} style={{ color: textColor }}>Loading user data...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    return (
        <div className={styles.userDataContainer} style={{ backgroundColor }}>
            <div className={styles.titleContainer}>
                <h2 style={{ color: textColor }}>User Profile</h2>
                <p style={{ color: textColor }}>Manage your account information</p>
            </div>

            <div className={`${styles.data} ${editMode ? styles.editable : ''}`} style={{ backgroundColor: backgroundColor2 }}>
                <div className={styles.profileHeader}>
                    <img
                        src={getAvatarImage(userData.role, userData.sex)}
                        alt={userData.name}
                        className={styles.profileAvatar}
                    />
                    <div className={styles.profileInfo}>
                        <h2 style={{ color: textColor }}>{userData.name} {userData.surname}</h2>
                        <p style={{ color: textColor }}>{userData.role}</p>
                        <p style={{ color: textColor }}>{userData.email}</p>
                    </div>
                </div>

                {editMode ? (
                    <form onSubmit={handleSubmit}>
                        <div className={styles.fieldGroup}>
                            <label htmlFor="name" style={{ color: textColor }}>First Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                style={{ backgroundColor: backgroundColor2, color: textColor }}
                            />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label htmlFor="surname" style={{ color: textColor }}>Last Name</label>
                            <input
                                type="text"
                                id="surname"
                                name="surname"
                                value={formData.surname}
                                onChange={handleInputChange}
                                required
                                style={{ backgroundColor: backgroundColor2, color: textColor }}
                            />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label htmlFor="email" style={{ color: textColor }}>Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                style={{ backgroundColor: backgroundColor2, color: textColor }}
                            />
                        </div>
                        <div className={styles.fieldGroup}>
                            <label htmlFor="bio" style={{ color: textColor }}>Bio</label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    backgroundColor: backgroundColor2,
                                    color: textColor,
                                    border: '1px solid #ddd'
                                }}
                            />
                        </div>
                        <div className={styles.buttonContainer}>
                            <button type="submit" className={styles.editButton}>
                                Save Changes
                            </button>
                            <button
                                type="button"
                                className={styles.editButton}
                                onClick={() => setEditMode(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className={styles.profileDetails}>
                        <div className={styles.detailSection}>
                            <h3 style={{ color: textColor }}>Bio</h3>
                            <p style={{ color: textColor }}>{userData.bio || 'No bio provided'}</p>
                        </div>
                        <div className={styles.detailSection}>
                            <h3 style={{ color: textColor }}>Courses</h3>
                            {coursesLoading ? (
                                <p style={{ color: textColor, fontStyle: 'italic' }}>Loading courses...</p>
                            ) : userData.courses && userData.courses.length > 0 ? (
                                userCourses.length > 0 ? (
                                    <ul className={styles.coursesList}>
                                        {userCourses.map(course => (
                                            <li key={course.id} style={{ color: textColor }}>
                                                <div>
                                                    <strong>{course.name}</strong>
                                                    {course.description && (
                                                        <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
                                                            {course.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p style={{ color: textColor, fontStyle: 'italic' }}>
                                        Unable to load course details
                                    </p>
                                )
                            ) : (
                                <p style={{ color: textColor }}>Not enrolled in any courses</p>
                            )}
                        </div>
                        <div className={styles.buttonContainer}>
                            <button
                                className={styles.editButton}
                                onClick={() => setEditMode(true)}
                            >
                                Edit Profile
                            </button>
                            <button
                                className={styles.logoutButton}
                                onClick={handleLogout}
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                )}

                {updateStatus.message && (
                    <div className={updateStatus.success ? styles.successMessage : styles.errorMessage}>
                        {updateStatus.message}
                    </div>
                )}
            </div>
        </div>
    );
}
