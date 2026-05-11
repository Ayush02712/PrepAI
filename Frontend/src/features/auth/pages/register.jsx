import React, { useState } from 'react';
import "../auth.form.scss";
import { useNavigate, Link } from "react-router";
import { useAuth } from '../hooks/useAuth';

const Register = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { loading, handleRegister } = useAuth();

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        try {

            await handleRegister({
                username,
                email,
                password
            });

            navigate("/generate");

        } catch (err) {

            setError(
                err?.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    if (loading) {
        return (
            <main>
                <h1>Loading.......</h1>
            </main>
        );
    }

    return (

        <main>

            <div className="form-container">

                <h1>Register</h1>

                <form onSubmit={handleSubmit}>

                    <div className="input-group">

                        <label htmlFor="username">
                            Username:
                        </label>

                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Enter username"
                        />

                    </div>

                    <div className="input-group">

                        <label htmlFor="email">
                            Email:
                        </label>

                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter email address"
                        />

                    </div>

                    <div className="input-group">

                        <label htmlFor="password">
                            Password:
                        </label>

                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter password"
                        />

                    </div>

                    {error && (
                        <p
                            style={{
                                color: "red",
                                marginBottom: "10px"
                            }}
                        >
                            {error}
                        </p>
                    )}

                    <button
                        className="button primary-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>

                </form>

                <p>
                    Already have an account?
                    {" "}
                    <Link to="/login">
                        Login here
                    </Link>
                </p>

            </div>

        </main>
    );
};

export default Register;