const pdfParse = require("pdf-parse");
const { generateInterviewReport , generatePreparationGuide } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");
const PreparationGuideModel =
require("../models/preparationGuide.model")

async function generateInterViewReportController(req, res) {
    try {
        console.log("1️⃣ Start");

        if (!req.file) {
            return res.status(400).json({ message: "Resume file is required" });
        }

        const data = await pdfParse(req.file.buffer);
        console.log("2️⃣ PDF parsed");

        const resumeContent = data.text
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 2000);
        const { selfDescription, jobDescription } = req.body;

       const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent,
            selfDescription,
            jobDescription
        });

        console.log("3️⃣ AI RESPONSE:", interViewReportByAi);

        // FIX technical questions
if (!Array.isArray(interViewReportByAi.technicalQuestions)) {
    interViewReportByAi.technicalQuestions = [];
}

interViewReportByAi.technicalQuestions =
    interViewReportByAi.technicalQuestions.map((q, index) => {

        // STRING CASE
        if (typeof q === "string") {
            return {
                question: q,
                intention: "Evaluate technical knowledge",
                answer: "Explain clearly with examples"
            };
        }

        // INVALID OBJECT CASE
        if (
            typeof q !== "object" ||
            q === null
        ) {
            return {
                question: `Technical Question ${index + 1}`,
                intention: "Evaluate technical knowledge",
                answer: "Explain clearly with examples"
            };
        }

        // VALID OBJECT CASE
        return {
            question:
                q.question || `Technical Question ${index + 1}`,

            intention:
                q.intention || "Evaluate technical knowledge",

            answer:
                q.answer || "Explain clearly with examples"
        };
    });

// FIX behavioral questions
if (!Array.isArray(interViewReportByAi.behavioralQuestions)) {
    interViewReportByAi.behavioralQuestions = [];
}

interViewReportByAi.behavioralQuestions =
    interViewReportByAi.behavioralQuestions.map((q, index) => {

        if (typeof q === "string") {
            return {
                question: q,
                intention: "Evaluate communication and teamwork",
                answer: "Use STAR method"
            };
        }

        if (
            typeof q !== "object" ||
            q === null
        ) {
            return {
                question: `Behavioral Question ${index + 1}`,
                intention: "Evaluate communication and teamwork",
                answer: "Use STAR method"
            };
        }

        return {
            question:
                q.question || `Behavioral Question ${index + 1}`,

            intention:
                q.intention || "Evaluate communication and teamwork",

            answer:
                q.answer || "Use STAR method"
        };
    });

        // 🔥 STEP 2: HANDLE ARRAY WITH STRING ITEMS
        
        interViewReportByAi.behavioralQuestions = interViewReportByAi.behavioralQuestions.map(q =>
            typeof q === "string"
                ? {
                    question: q,
                    intention: "Evaluate behavior",
                    answer: "Use STAR method"
                }
                : q
        );
        // FIX skill gaps
if (!Array.isArray(interViewReportByAi.skillGaps)) {
    interViewReportByAi.skillGaps = [];
}

interViewReportByAi.skillGaps =
    interViewReportByAi.skillGaps.map(skill =>
        typeof skill === "string"
            ? {
                skill,
                severity: "medium"
            }
            : skill
    );


// FIX preparation plan
if (!Array.isArray(interViewReportByAi.preparationPlan)) {
    interViewReportByAi.preparationPlan = [];
}

interViewReportByAi.preparationPlan =
    interViewReportByAi.preparationPlan.map((plan, index) => {

        // STRING CASE
        if (typeof plan === "string") {
            return {
                day: index + 1,
                focus: plan,
                tasks: ["Study and practice"]
            };
        }

        // NUMBER CASE
        if (typeof plan === "number") {
            return {
                day: plan,
                focus: "Interview Preparation",
                tasks: ["Study and practice"]
            };
        }

        // INVALID OBJECT CASE
        if (
            typeof plan !== "object" ||
            plan === null
        ) {
            return {
                day: index + 1,
                focus: "Interview Preparation",
                tasks: ["Study and practice"]
            };
        }

        // VALID OBJECT CASE
        return {
            day:
                typeof plan.day === "number"
                    ? plan.day
                    : index + 1,

            focus:
                plan.focus || "Interview Preparation",

            tasks:
                Array.isArray(plan.tasks)
                    ? plan.tasks
                    : ["Study and practice"]
        };
    });

        // 🔥 STEP 3: ENSURE NOT EMPTY
        if (!interViewReportByAi.technicalQuestions.length) {
            interViewReportByAi.technicalQuestions.push({
                question: "Explain a core concept from your domain.",
                intention: "Test fundamentals",
                answer: "Explain with clarity and examples"
            });
        }

        if (!interViewReportByAi.behavioralQuestions.length) {
            interViewReportByAi.behavioralQuestions.push({
                question: "Tell me about a challenge you faced.",
                intention: "Evaluate problem-solving",
                answer: "Use STAR method"
            });
        }

        // 🔥 STEP 4: SAVE TO DB
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent,
            selfDescription,
            jobDescription,
            ...interViewReportByAi,
            title: interViewReportByAi.title || jobDescription || "Untitled Role"
        });

        console.log("4️⃣ DB saved");

        return res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        });

    } catch (error) {
        console.error("❌ ERROR:", error);
        return res.status(500).json({
            message: error.status === 503
    ? "AI server is busy. Please try again in a moment."
    : "Error generating interview report.",
            error: error.message
        });
    }
}  



/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


async function generatePreparationGuideController(req, res) {

    try {

        const {
            company,
            role,
            experienceLevel,
            preparationTime
        } = req.body;

        const result =
            await generatePreparationGuide({
                company,
                role,
                experienceLevel,
                preparationTime
            });

        const guide =
            await PreparationGuideModel.create({

                user: req.user.id,

                company,

                role,

                experienceLevel,

                preparationTime,

                result
            });

        return res.status(200).json({
            guide
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message:
            "Error generating guide"
        });
    }
}

async function getPreparationGuidesController(req, res) {

    try {

        const guides =
            await PreparationGuideModel
                .find({
                    user: req.user.id
                })
                .sort({ createdAt: -1 });

        return res.status(200).json({
            guides
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message:
            "Error fetching guides"
        });
    }
}

async function getPreparationGuideByIdController(
    req,
    res
){

    try {

        const { guideId } = req.params;

        const guide =
            await PreparationGuideModel.findOne({

                _id: guideId,

                user: req.user.id
            });

        if(!guide){

            return res.status(404).json({
                message: "Guide not found"
            })
        }

        return res.status(200).json({
            guide
        });

    } catch(error){

        console.log(error);

        return res.status(500).json({
            message:
            "Error fetching guide"
        })
    }
}

async function getPreparationGuidesController(
    req,
    res
){

    try {

        const guides =
            await PreparationGuideModel
            .find({
                user: req.user.id
            })
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            guides
        });

    } catch(error){

        console.log(error);

        return res.status(500).json({
            message:
            "Error fetching guides"
        });
    }
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generatePreparationGuideController, getPreparationGuidesController, getPreparationGuideByIdController, getPreparationGuidesController }