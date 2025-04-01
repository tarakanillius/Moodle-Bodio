import React from "react";
import {
    Route,
    Navigate,
    RouterProvider,
    createRoutesFromElements, createBrowserRouter
} from "react-router-dom";
import Login from "./pages/Login";
import Main from "./pages/Main";

function App() {
    const routeDefinitions = createRoutesFromElements(
        <Route>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/main" element={<Main />} />
        </Route>
    )

    return (
        <RouterProvider router={createBrowserRouter(routeDefinitions)}/>
    );
}

export default App;
