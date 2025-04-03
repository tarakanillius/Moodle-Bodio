import React from 'react';
import getAvatarImage from "../../utils/getAvatar";
import styles from "../../styles/courseDetail.module.css";
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'

function Example() {
    let [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button onClick={() => setIsOpen(true)}>Open dialog</button>
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
                        <DialogTitle className="font-bold">Deactivate account</DialogTitle>
                        <Description>This will permanently deactivate your account</Description>
                        <p>Are you sure you want to deactivate your account? All of your data will be permanently removed.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setIsOpen(false)}>Cancel</button>
                            <button onClick={() => setIsOpen(false)}>Deactivate</button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    )
}

export default function StudentsTab({ course }){
    return (
        <div className={styles.studentsContainer}>
            <h2 className={styles.studentsTitle}>Enrolled Students</h2>
            {course.students && course.students.length > 0 ? (
                <ul className={styles.studentsList}>
                    {course.students.map(student => (
                        <li key={student.id} className={styles.studentItem} onClick={() => <StudentsTab/>}>
                            <img
                                src={getAvatarImage("student", student.gender || "male")}
                                alt={student.name}
                                className={styles.studentAvatar}
                            />
                            <div className={styles.studentInfo}>
                                <span className={styles.studentName}>{student.name}</span>
                                <span className={styles.studentEmail}>{student.email}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className={styles.noStudents}>No students enrolled in this course</p>
            )}
        </div>
    );
};
