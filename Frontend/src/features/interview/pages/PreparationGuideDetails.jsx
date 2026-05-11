import React from "react";

import {
    usePreparationGuide
}
from "../hooks/usePreparationGuide";

import "../style/preparationGuide.scss";

const PreparationGuideDetails = () => {

    const {
        loading,
        guide
    } = usePreparationGuide();

    if (loading || !guide) {

        return (

            <main className="loading-screen">

                <h1>
                    Loading Guide...
                </h1>

            </main>
        )
    }

    return (

        <div className="prep-page">

            <div className="prep-container">

                <div className="result-box">

                    <h1>
                        {guide.company}
                    </h1>

                    <p className="prep-subtitle">

                        {guide.role}

                    </p>

                    <pre>

                        {guide.result}

                    </pre>

                </div>

            </div>

        </div>
    )
}

export default PreparationGuideDetails;