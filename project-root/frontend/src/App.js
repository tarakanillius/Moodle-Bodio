import React from "react";
import {
    Route,
    Navigate,
    RouterProvider,
    createRoutesFromElements, createBrowserRouter
} from "react-router-dom";
import Login from "./pages/Login";
import Main from "./pages/Main";
import UserData from "./pages/UserData";

export default function  App() {
    const routeDefinitions = createRoutesFromElements(
        <Route>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/main" element={<Main />} />
            <Route path="/userData" element={<UserData/>} />
        </Route>
    )

    return (
        <RouterProvider router={createBrowserRouter(routeDefinitions)}/>
    );
}
