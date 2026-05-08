import { createBrowserRouter } from "react-router-dom";

import Login from "./features/auth/pages/login";
import Register from "./features/auth/pages/register";

import Protected from "./features/auth/components/protected";

import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";

import Layout from "./components/Layout";

import Landing from "./features//interview/pages/Landing";


export const router = createBrowserRouter([

    {
    path: "/",
    element: <Landing />
    },

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
                path: "/generate",
                element: <Home />
            },

            {
                path: "/interview/:interviewId",
                element: <Interview />
            }
        ]
    }
]);