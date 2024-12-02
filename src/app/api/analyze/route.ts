import { compareData } from "@/lib/compareData";
import { parseNestedJSON } from "@/lib/parseJson";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        if (!body.jobDescription) {
            return NextResponse.json(
                { message: "Job description is required" },
                { status: 400 }
            );
        }
        if (!body.rawText) {
            return NextResponse.json(
                { message: "Raw text is required" },
                { status: 400 }
            );
        }

        // Compare job description and raw text
        const comparedData = await compareData({
            jobDescription: body.jobDescription,
            rawText: body.rawText
        });

        console.log("Compared data:", comparedData);

        // Utility function to parse each JSON text field and replace it with a proper JSON structure
        const parsedResponse = parseNestedJSON(comparedData);
        console.log("Parsed response:", parsedResponse);

        return NextResponse.json(
            { message: "PDF analyzed successfully", data: parsedResponse },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in POST /api/analyze:", error);
        return NextResponse.json(
            { error: "Failed to analyze contents" },
            { status: 500 }
        );
    }
}