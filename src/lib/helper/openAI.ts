import { OpenAI } from 'openai';

export default function openAI() {
    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY!,
    });

    const callOpenAI = async (selectedModel: string, prompt: string): Promise<string | null> => {
        try {
            const response = await client.chat.completions.create({
                model: selectedModel,
                messages: [{ role: "user", content: prompt }],
            });
            return response.choices[0].message?.content;
        } catch (error) {
            console.error("OpenAI API failed", error);
            return null;
        }
    };

    return { callOpenAI };
};
