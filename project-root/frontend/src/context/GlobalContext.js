import { createContext, useState } from "react";

export const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
    const [selectedComponent, setSelectedComponent] = useState("home");

    return (
        <GlobalContext.Provider value={{ selectedComponent, setSelectedComponent }}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
