import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from "./pages/Main";
import GlobalProvider from "./context/GlobalContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <GlobalProvider>
            <Main/>
        </GlobalProvider>
    </React.StrictMode>
);
