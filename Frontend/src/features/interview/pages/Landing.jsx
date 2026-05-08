import React from "react"
import { useNavigate } from "react-router"

const Landing = () => {
    const navigate = useNavigate()

    return (

    <div className='landing-page'>

        <nav className='landing-navbar'>

            <h2 className='logo'>
                PrepAI
            </h2>

            <div className='nav-links'>

                <button
                    onClick={() => navigate("/login")}
                    className='nav-btn'
                >
                    Login
                </button>

                <button
                    onClick={() => navigate("/register")}
                    className='nav-primary-btn'
                >
                    Register
                </button>

            </div>

        </nav>

        <section className='hero-section'>

            <div className='hero-content'>

                <span className='hero-badge'>
                    AI-Powered Interview Preparation
                </span>

                <h1>
                    Prepare Smarter.
                    <br />
                    Interview Better.
                </h1>

                <p>
                    Upload your resume, paste a job description, and let AI generate
                    personalized interview questions, skill-gap analysis, match scores,
                    and preparation roadmaps.
                </p>

                <div className='hero-buttons'>

                    <button
    className='hero-primary-btn'
    onClick={() => navigate("/register")}
>
                        Start Preparing
                    </button>

                   

                </div>

            </div>

            <div className='hero-preview'>

                <div className='preview-card'>
                    <span>Match Score</span>
                    <h2>78%</h2>
                </div>

                <div className='preview-card'>
                    <span>Skill Gaps</span>
                    <h2>3 Areas</h2>
                </div>

                <div className='preview-card'>
                    <span>AI Questions</span>
                    <h2>10+</h2>
                </div>

            </div>

        </section>

       </div> 
    )
}

export default Landing