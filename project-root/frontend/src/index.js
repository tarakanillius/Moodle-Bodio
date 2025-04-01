import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import GlobalProvider from "./context/GlobalContext";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <GlobalProvider>
            <App/>
        </GlobalProvider>
    </React.StrictMode>
);

