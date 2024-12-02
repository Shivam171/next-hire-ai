import googleGenerativeAI from "./helper/googleGenerativeAI";
import { generateQuizPrompt } from "./prompts";

export async function generateQuiz({ jobDescription }: { jobDescription: string }) {
    const { callGoogleGenerativeAI } = googleGenerativeAI();

    // Select model
    const googleGenerativeAIModel = "gemini-1.5-flash";

    let generateQuiz: any;

    try {
        const prompt = generateQuizPrompt(jobDescription);
        generateQuiz = await callGoogleGenerativeAI(googleGenerativeAIModel, prompt);
    } catch (error) {
        console.error("An error occurred while generating the quiz:", error);
        return null;
    }

    return generateQuiz;
}