import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import Navbar from "./Navbar";

const Layout = () => {

    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
};

export default Layout;