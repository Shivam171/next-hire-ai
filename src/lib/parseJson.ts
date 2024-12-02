export function parseNestedJSON(data: any) {
    const parseAndClean = (text: string) => {
        const cleanedText = text.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanedText);
    };

    if (data.spellingMistakes && data.spellingMistakes[0]?.text) {
        data.spellingMistakes = parseAndClean(data.spellingMistakes[0].text).spellingMistakes;
    }

    if (data.keywordMatch && data.keywordMatch[0]?.text) {
        const parsed = parseAndClean(data.keywordMatch[0].text);
        data.matchedKeywords = parsed.matchedKeywords;
        data.suggestedKeywords = parsed.suggestedKeywords;
        delete data.keywordMatch;
    }

    if (data.skillSetAnalysis && data.skillSetAnalysis[0]?.text) {
        data.skillSetAnalysis = parseAndClean(data.skillSetAnalysis[0].text).skillSetAnalysis;
    }

    if (data.helpfulInsights && data.helpfulInsights[0]?.text) {
        const parsed = parseAndClean(data.helpfulInsights[0].text);
        data.helpfulInsights = parsed.helpfulInsights;
    }

    if (data.combinedScore && data.combinedScore[0]?.text) {
        data.combinedScore = parseAndClean(data.combinedScore[0].text).combinedScore;
    }

    const parseQuiz = (text: string) => {
        // Only strip the initial and final ```json tags if they surround the JSON
        const cleanedText = text.trim();
        if (cleanedText.startsWith("```json") && cleanedText.endsWith("```")) {
            const jsonText = cleanedText.slice(7, -3).trim();
            return JSON.parse(jsonText);
        }
        return JSON.parse(cleanedText); // Parse directly if no enclosing ```json tags
    };

    if (Array.isArray(data) && data[0]?.text) {
        const parsed = parseQuiz(data[0].text);
        data[0] = parsed;
    }

    return data;
}
