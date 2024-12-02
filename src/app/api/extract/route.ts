import { NextResponse } from "next/server";
import extractTextFromPDF from "@/lib/getRawData";
export async function POST(request: Request) {
    try {
        const body = await request.json();
        if (!body.pdfUrl) {
            return Response.json(
                { error: "PDF URL is required" },
                { status: 400 }
            );
        }
        const extractedText = await extractTextFromPDF(body.pdfUrl);
        return NextResponse.json(
            { message: "PDF extracted successfully", text: extractedText },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in POST /api/extract:", error);
        return NextResponse.json(
            { error: "Failed to extract PDF contents" },
            { status: 500 }
        );
    }
}