import { createBrowserRouter } from "react-router-dom";

import Login from "./features/auth/pages/login";
import Register from "./features/auth/pages/register";

import Protected from "./features/auth/components/protected";

import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";

import Layout from "./components/Layout";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },

    {
        path: "/register",
        element: <Register />
    },

    {
        element: (
            <Protected>
                <Layout />
            </Protected>
        ),

        children: [
            {
                path: "/",
                element: <Home />
            },

            {
                path: "/interview/:interviewId",
                element: <Interview />
            }
        ]
    }
]);