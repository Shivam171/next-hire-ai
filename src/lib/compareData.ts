import googleGenerativeAI from "./helper/googleGenerativeAI";
import { combinedScorePrompt, helpfulInsightsPrompt, matchedAndSuggestedKeywordPrompt, skillSetAnalysisPrompt, spellingMistakesPrompt } from "./prompts";

type CompareDataProps = {
  jobDescription: string;
  rawText: string;
};

export async function compareData({ jobDescription, rawText }: CompareDataProps) {
  const { callGoogleGenerativeAI } = googleGenerativeAI();

  // Select model
  const googleGenerativeAIModel = "gemini-1.5-flash";

  // 1. Spelling Mistakes
  let spellingMistakes: any;
  try {
    const prompt = spellingMistakesPrompt(rawText);
    spellingMistakes = await callGoogleGenerativeAI(googleGenerativeAIModel, prompt);
  } catch (error) {
    console.log("An error occurred while calling Google Generative AI API:", error);
    return { spellingMistakes: [] };
  }
  // console.log("Spelling mistakes:", spellingMistakes);

  // 2. Keyword Match
  let keywordMatch: any;
  try {
    const prompt = matchedAndSuggestedKeywordPrompt(jobDescription, rawText);
    keywordMatch = await callGoogleGenerativeAI(googleGenerativeAIModel, prompt);
  } catch (error) {
    console.log("An error occurred while calling Google Generative AI API:", error);
    return { matchedKeywords: [], suggestedKeywords: [] };
  }
  // console.log("Keyword Match: ", keywordMatch);

  // 3. Skill set Analysis
  let skillSetAnalysis: any;
  try {
    const prompt = skillSetAnalysisPrompt(jobDescription, rawText);
    skillSetAnalysis = await callGoogleGenerativeAI(googleGenerativeAIModel, prompt);
  } catch (error) {
    console.log("An error occurred while calling Google Generative AI API:", error);
    return { skillSetAnalysis: [] };
  }
  // console.log("SkillSet Analysis:", skillSetAnalysis);

  // 4. Helpful Insights
  let helpfulInsights: any;
  try {
    const prompt = helpfulInsightsPrompt(jobDescription, rawText);
    helpfulInsights = await callGoogleGenerativeAI(googleGenerativeAIModel, prompt);
  } catch (error) {
    console.log("An error occurred while calling Google Generative AI API:", error);
    return { helpfulInsights: [] };
  }
  // console.log("Helpful Insights:", helpfulInsights);

  // 5. Overall Score
  let combinedScore: any;
  try {
    const prompt = combinedScorePrompt(jobDescription, rawText);
    combinedScore = await callGoogleGenerativeAI(googleGenerativeAIModel, prompt);
  } catch (error) {
    console.log("An error occurred while calling Google Generative AI API:", error);
    return { combinedScore: [] };
  }
  // console.log("Overall ATS Score:", combinedScore);

  return {
    spellingMistakes,
    keywordMatch,
    skillSetAnalysis,
    helpfulInsights,
    combinedScore,
  };
}
