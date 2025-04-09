import React, {useRef, useEffect, useContext} from 'react';
import styles from '../styles/dropdown.module.css';
import { GlobalContext } from "../context/GlobalContext";

export default function Dropdown({trigger, isOpen, setIsOpen, items, borderColor, position = 'right'}) {
    const { backgroundColor, backgroundColor2, textColor } = useContext(GlobalContext);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef, setIsOpen]);

    return (
        <div
            className={styles.dropdownContainer}
            ref={dropdownRef}
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', zIndex: 1000 }}
        >
            <div
                className={styles.triggerContainer}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
            >
                {trigger}
            </div>

            {isOpen && (
                <div
                    className={styles.dropdownMenu}
                    style={{
                        backgroundColor: backgroundColor,
                        border: `1px solid ${borderColor || '#e2e8f0'}`,
                        [position === 'right' ? 'right' : 'left']: 0,
                        zIndex: 1001
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {items.map((item, index) => (
                        <button
                            key={index}
                            className={`${styles.dropdownItem} ${item.className || ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (item.onClick) item.onClick(e);
                                if (!item.keepOpen) setIsOpen(false);
                            }}
                            style={{
                                backgroundColor: backgroundColor2,
                                color: item.className === 'deleteButton' ? '#e53e3e' : textColor
                            }}
                        >
                            {item.icon && <span className={styles.itemIcon}>{item.icon}</span>}
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
