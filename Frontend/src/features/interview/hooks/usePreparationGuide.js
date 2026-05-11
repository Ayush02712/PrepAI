import {
    generatePreparationGuide,
    getPreparationGuides,
    getPreparationGuideById
}
from "../services/interview.api"

import {
    useEffect,
    useState
}
from "react"

import { useParams }
from "react-router"

export const usePreparationGuide = () => {

    const [loading, setLoading] =
        useState(false);

    const [guide, setGuide] =
        useState(null);

    const [guides, setGuides] =
        useState([]);

    const { guideId } =
        useParams();

    const generateGuide = async (data) => {

        setLoading(true);

        let response = null;

        try {

            response =
                await generatePreparationGuide(data);

            setGuide(response.guide);

        } catch(error){

            console.log(error);

        } finally {

            setLoading(false);
        }

        return response.guide;
    }

    const fetchGuideById = async (guideId) => {

        setLoading(true);

        try {

            const response =
                await getPreparationGuideById(
                    guideId
                );

            setGuide(response.guide);

        } catch(error){

            console.log(error);

        } finally {

            setLoading(false);
        }
    }

    const fetchGuides = async () => {

        setLoading(true);

        try {

            const response =
                await getPreparationGuides();

            setGuides(response.guides);

        } catch(error){

            console.log(error);

        } finally {

            setLoading(false);
        }
    }

    useEffect(() => {

        if(guideId){

            fetchGuideById(guideId);

        } else {

            fetchGuides();
        }

    }, [guideId])

    return {

        loading,

        guide,

        guides,

        generateGuide,

        fetchGuideById,

        fetchGuides
    }
}