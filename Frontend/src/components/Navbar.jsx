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
                AI Job Prep
            </div>

            <div className="nav-links">

                <Link to="/">Home</Link>

                {!user ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    <button onClick={logoutUser}>
                        Logout
                    </button>
                )}

            </div>

        </nav>
    );
};

export default Navbar;