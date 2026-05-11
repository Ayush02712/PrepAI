const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")


const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
     matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),

    verdict: z.enum([
        "Weak Match",
        "Moderate Match",
        "Good Match",
        "Strong Match",
        "Excellent Match"
    ]).describe("Overall candidate suitability verdict based strictly on matchScore"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question that can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription,title }) {


const prompt = `
You are an expert AI interview coach.

Return ONLY valid JSON.

The output MUST strictly follow the provided schema.

DO NOT:
- return markdown
- return explanations
- return arrays of strings
- stringify JSON
- omit any field

REQUIRED FIELDS:
- matchScore
- verdict
- technicalQuestions
- behavioralQuestions
- skillGaps
- preparationPlan
- title

STRICT REQUIREMENTS:

1. matchScore
- MUST be a number between 0 and 100
- MUST represent how well the candidate matches the job description
Scoring Guidelines:

90-100:
Candidate strongly matches almost all required skills and experience.

75-89:
Candidate matches many core technical requirements but has some gaps.

60-74:
Candidate has partial alignment but lacks important required skills.

40-59:
Candidate has general technical background but lacks major domain-specific skills.

0-39:
Candidate lacks most required skills and experience.

IMPORTANT:
Be STRICT while scoring.
Missing core required technologies or experience should significantly reduce the score.

1.1 verdict

The verdict MUST strictly follow these score ranges:

0-39:
Weak Match

40-59:
Moderate Match

60-74:
Good Match

75-89:
Strong Match

90-100:
Excellent Match

IMPORTANT:
- verdict MUST align with matchScore
- NEVER contradict the score

2. technicalQuestions
- MUST be an array of at least 5 OBJECTS
- EACH object MUST contain:
  - question
  - intention
  - answer

  DO NOT combine question, intention, and answer into a single string.
  Each field must be separate.

Example:
{
  "question": "Explain REST APIs",
  "intention": "Evaluate backend fundamentals",
  "answer": "Discuss HTTP methods and stateless communication"
}

3. behavioralQuestions
- MUST be an array of at least 5 OBJECTS
- EACH object MUST contain:
  - question
  - intention
  - answer

4. skillGaps
- MUST be an array of OBJECTS
- DO NOT return strings

EACH object MUST contain:
- skill
- severity

severity MUST ONLY be:
- low
- medium
- high

Example:
{
  "skill": "System Design",
  "severity": "high"
}

5. preparationPlan
- MUST be an array of OBJECTS
- MUST contain EXACTLY 7 days
- day values MUST start from 1 and end at 7
- DO NOT skip any days
- Returning more or fewer than 7 days is invalid
- DO NOT return strings
- DO NOT return numbers directly inside the array
- Each day MUST contain maximum 2 tasks
- Tasks MUST be concise

Example:
{
  "day": 1,
  "focus": "Data Structures",
  "tasks": [
    "Solve 5 array problems",
    "Revise time complexity"
  ]
}


IMPORTANT:
Return ONLY raw JSON object.

Candidate Details:

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })

    return JSON.parse(response.text)


}

async function generatePreparationGuide({
    company,
    role,
    experienceLevel,
    preparationTime
}) {

    const prompt = `
You are an expert software engineering interview coach.

Generate a preparation guide for:

Company: ${company}
Role: ${role}
Experience Level: ${experienceLevel}
Preparation Time: ${preparationTime}

Include:

1. Important technical topics
2. Common interview focus areas
3. Behavioral preparation tips
4. 10 practice questions
5. A concise preparation roadmap

Keep the response practical, concise, and structured.
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    })

    return response.text
}

module.exports = { generateInterviewReport, generatePreparationGuide }