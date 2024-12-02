import axios from 'axios';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export default async function extractTextFromPDF(pdfUrl: string) {
    try {
        // Download the PDF
        const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);

        // Convert Buffer to Blob
        const blob = new Blob([buffer], { type: 'application/pdf' });

        // Use Langchain's PDFLoader to load the PDF from the buffer
        const loader = new PDFLoader(blob);
        const pages = await loader.load();

        // Extract and clean the text from the PDF
        const cleanedText = cleanPDFText(pages.map(page => page.pageContent).join('\n'));

        return cleanedText;

    } catch (error) {
        console.error('Error in extracting PDF contents:', error);
        throw error;
    }
}

function cleanPDFText(text: string) {
    return text
        // Replace multiple spaces with a single space
        .replace(/\s+/g, ' ')
        // Replace multiple newlines with a single space
        .replace(/[\n\r]+/g, ' ')
}      