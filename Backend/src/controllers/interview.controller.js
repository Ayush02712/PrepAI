const pdfParse = require("pdf-parse");
const { generateInterviewReport } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

async function generateInterViewReportController(req, res) {
    try {
        console.log("1️⃣ Start");

        if (!req.file) {
            return res.status(400).json({ message: "Resume file is required" });
        }

        const data = await pdfParse(req.file.buffer);
        console.log("2️⃣ PDF parsed");

        const resumeContent = data.text;
        const { selfDescription, jobDescription } = req.body;

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent,
            selfDescription,
            jobDescription
        });

        console.log("3️⃣ AI RESPONSE:", interViewReportByAi);

        // 🔥 STEP 1: FORCE STRUCTURE (MOST IMPORTANT)

        // Fix technicalQuestions
if (typeof interViewReportByAi.technicalQuestions === "string") {
    try {
        interViewReportByAi.technicalQuestions = JSON.parse(
            interViewReportByAi.technicalQuestions
        );
    } catch {
        interViewReportByAi.technicalQuestions = [];
    }
}

// FIX behavioral questions
if (typeof interViewReportByAi.behavioralQuestions === "string") {
    try {
        interViewReportByAi.behavioralQuestions = JSON.parse(
            interViewReportByAi.behavioralQuestions
        );
    } catch {
        interViewReportByAi.behavioralQuestions = [];
    }
}

        // 🔥 STEP 2: HANDLE ARRAY WITH STRING ITEMS
        interViewReportByAi.technicalQuestions = interViewReportByAi.technicalQuestions.map(q =>
            typeof q === "string"
                ? {
                    question: q,
                    intention: "Evaluate technical knowledge",
                    answer: "Explain clearly with examples"
                }
                : q
        );

        interViewReportByAi.behavioralQuestions = interViewReportByAi.behavioralQuestions.map(q =>
            typeof q === "string"
                ? {
                    question: q,
                    intention: "Evaluate behavior",
                    answer: "Use STAR method"
                }
                : q
        );

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
            message: "Error generating interview report.",
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





module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController }