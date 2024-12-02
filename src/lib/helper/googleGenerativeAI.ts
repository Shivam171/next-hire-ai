import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

export default function googleGenerativeAI() {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
    ];

    const callGoogleGenerativeAI = async (selectedModel: string, prompt: string): Promise<string | null> => {
        const model = genAI.getGenerativeModel({ 
            model: selectedModel, 
            safetySettings: safetySettings,
        });
        try {
            const response = await model.generateContent(prompt);

            // Check if candidates exist
            const candidates = response.response.candidates || [];

            let contentParts;

            // Log content parts and safety ratings for each candidate
            candidates.forEach((candidate) => {
                contentParts = candidate.content?.parts || [];
            });

            return contentParts || null;
        } catch (error) {
            console.error("Google Generative AI API failed", error);
            throw error;
        }
    };

    return { callGoogleGenerativeAI };
};
