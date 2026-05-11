import React,
{
    useState
}
from "react";

import { useNavigate }
from "react-router";

import {
    usePreparationGuide
}
from "../hooks/usePreparationGuide";

import "../style/preparationGuide.scss";

const PreparationGuide = () => {

    const [company, setCompany] =
        useState("");

    const [role, setRole] =
        useState("");

    const [
        experienceLevel,
        setExperienceLevel
    ] = useState("");

    const [
        preparationTime,
        setPreparationTime
    ] = useState("");

    const navigate = useNavigate();

    const {
        loading,
        guides,
        generateGuide
    } = usePreparationGuide();

    const handleGenerate = async () => {

        if (
            !company.trim() ||
            !role.trim() ||
            !experienceLevel ||
            !preparationTime
        ) {

            alert("Please fill all fields");

            return;
        }

        const data =
            await generateGuide({

                company,

                role,

                experienceLevel,

                preparationTime
            });

        navigate(
            `/preparation-guide/${data._id}`
        );
    }

    return (

        <div className="prep-page">

            <div className="prep-container">

                <div className="prep-box">

                    <h1>
                        Create Your AI Prep Guide
                    </h1>

                    <p className="prep-subtitle">
                        Generate personalized
                        interview preparation
                        strategies using AI.
                    </p>

                    <div className="prep-form">

                        <input
                            placeholder="Company"
                            value={company}
                            onChange={(e) =>
                                setCompany(
                                    e.target.value
                                )}
                        />

                        <input
                            placeholder="Role"
                            value={role}
                            onChange={(e) =>
                                setRole(
                                    e.target.value
                                )}
                        />

                        <select
                            value={experienceLevel}
                            onChange={(e) =>
                                setExperienceLevel(
                                    e.target.value
                                )}
                        >

                            <option value="">
                                Experience Level
                            </option>

                            <option value="Beginner">
                                Beginner
                            </option>

                            <option value="Intermediate">
                                Intermediate
                            </option>

                            <option value="Advanced">
                                Advanced
                            </option>

                        </select>

                        <select
                            value={preparationTime}
                            onChange={(e) =>
                                setPreparationTime(
                                    e.target.value
                                )}
                        >

                            <option value="">
                                Preparation Time
                            </option>

                            <option value="1 Week">
                                1 Week
                            </option>

                            <option value="2 Weeks">
                                2 Weeks
                            </option>

                            <option value="1 Month">
                                1 Month
                            </option>

                            <option value="3+ Months">
                                3+ Months
                            </option>

                        </select>

                        <button
                            className="generate-btn"
                            onClick={handleGenerate}
                        >

                            {
                                loading
                                ? "Generating..."
                                : "Generate Guide"
                            }

                        </button>

                    </div>

                </div>

                <div className="recent-guides">

                    <div className="recent-header">

                        <h2>
                            Recent AI Prep Guides
                        </h2>

                    </div>

                    <div className="guides-grid">

                        {
                            [...guides]
                            .sort(
                                (a, b) =>
                                    new Date(b.createdAt)
                                    -
                                    new Date(a.createdAt)
                            )
                            .map((guide) => (

                                <div
                                    key={guide._id}
                                    className="guide-card"

                                    onClick={() =>
                                        navigate(
                                            `/preparation-guide/${guide._id}`
                                        )
                                    }
                                >

                                    <h3>
                                        {guide.company}
                                    </h3>

                                    <p>
                                        {guide.role}
                                    </p>

                                    <span>
                                        {
                                            guide
                                            .experienceLevel
                                        }
                                    </span>

                                </div>
                            ))
                        }

                    </div>

                </div>

            </div>

        </div>
    )
}

export default PreparationGuide;