export const getThemeSettings = (darkMode) => {
    if (darkMode) {
        return {
            backgroundColor: '#1a1a1a',
            backgroundColor2: '#2d2d2d',
            textColor: '#ffffff'
        };
    } else {
        return {
            backgroundColor: '#f5f5f5',
            backgroundColor2: '#ededed',
            textColor: '#333333'
        };
    }
};

export const toggleDarkMode = (currentMode) => {
    const newMode = !currentMode;
    localStorage.setItem('darkMode', newMode);
    return newMode;
};

export const initializeTheme = () => {
    return localStorage.getItem('darkMode') === 'true';
};

export const saveLanguagePreference = (language) => {
    localStorage.setItem('language', language);
    return language;
};

export const getLanguagePreference = () => {
    return localStorage.getItem('language') || 'Italiano';
};
