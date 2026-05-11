import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../features/auth/hooks/useAuth";

import "./navbar.scss";

const Navbar = () => {

    const { user, handleLogout } = useAuth();

    const navigate = useNavigate();

    const logoutUser = async () => {

        await handleLogout();

        navigate("/login");
    };

    return (

        <nav className="navbar">

            <div className="logo">
                PrepAI
            </div>

            <div className="nav-links">

                <Link to="/">
                    Home
                </Link>

                {user && (
                    <>
                        <Link to="/generate">
                            Resume Analyzer
                        </Link>

                        <Link to="/preparation-guide">
                            AI Prep Guide
                        </Link>

                        <button onClick={logoutUser}>
                            Logout
                        </button>
                    </>
                )}

                {!user && (
                    <>
                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Register
                        </Link>
                    </>
                )}

            </div>

        </nav>
    );
};

export default Navbar;