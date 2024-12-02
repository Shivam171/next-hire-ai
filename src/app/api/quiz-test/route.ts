import { NextResponse } from "next/server";
import { generateQuiz } from "@/lib/generateQuiz";
import { parseNestedJSON } from "@/lib/parseJson";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        if (!body.jobDescription) {
            return NextResponse.json(
                { message: "Job description is required" },
                { status: 400 }
            );
        }

        // Generate quiz
        const generatedQuiz = await generateQuiz(body.jobDescription);

        console.log("Generated quiz:", generatedQuiz);
        

        // Utility function to parse each JSON text field and replace it with a proper JSON structure
        const parsedResponse = parseNestedJSON(generatedQuiz);

        console.log("Parsed response:", parsedResponse);

        return NextResponse.json(
            { message: "Quiz generated successfully", data: parsedResponse },
            { status: 200 }
        );

    } catch (error) {
        console.log("Error in POST /api/quiz-test:", error);
        return NextResponse.json(
            { error: "Failed to generate quiz" },
            { status: 500 }
        )
    }
}