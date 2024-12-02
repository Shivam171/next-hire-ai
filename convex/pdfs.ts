import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { FileType } from '@/lib/types';

export const addPdfDetails = mutation({
    args: {
        userId: v.string(),
        file: v.array(
            v.object({
                fileId: v.string(),
                fileName: v.string(),
                fileUrl: v.string(),
                rawText: v.string(),
                formattedText: v.optional(v.object({
                    combinedScore: v.object({
                        keywordMatchScore: v.string(),
                        overallScore: v.string(),
                        skillsetMatchScore: v.string(),
                        suggestedImprovements: v.array(v.string()),
                    }),
                    helpfulInsights: v.object({
                        matchedPhrases: v.array(v.string()),
                        sentimentComparison: v.array(v.string()),
                        suggestedPhrases: v.array(v.string()),
                    }),
                    matchedKeywords: v.array(v.string()),
                    skillSetAnalysis: v.array(v.string()),
                    spellingMistakes: v.array(v.object({
                        correct: v.string(),
                        incorrect: v.string(),
                    })),
                    suggestedKeywords: v.array(v.string()),
                })),
                jobDescription: v.optional(v.string()),
                creationTime: v.optional(v.number()),
            })
        ),
    },

    handler: async (ctx, args) => {
        // Get the current timestamp in milliseconds
        const currentTime = Date.now();

        // Add _creationTime to each file in args.file
        const filesWithCreationTime = args.file.map(file => ({
            ...file,
            creationTime: currentTime,
        }));

        // Fetch the existing document by userId
        const existingDocument = await ctx.db.query("pdfs")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .first();

        if (existingDocument) {
            // Append the new file details to the existing file array
            const updatedFileArray = [...existingDocument.file, ...filesWithCreationTime];

            // Update the existing document with the new file array
            await ctx.db.patch(existingDocument._id, {
                file: updatedFileArray,
            });

            return { success: true, type: 'updated', id: existingDocument._id };

        } else {
            // If the document does not exist, create a new document with the file array
            const insertedId = await ctx.db.insert("pdfs", {
                userId: args.userId,
                file: filesWithCreationTime,
            });

            return { success: true, type: 'inserted', id: insertedId };
        }
    }
})

export const updateFormattedTextDetails = mutation({
    args: {
        userId: v.string(),
        fileId: v.string(),
        formattedText: v.object({
            combinedScore: v.object({
                keywordMatchScore: v.string(),
                overallScore: v.string(),
                skillsetMatchScore: v.string(),
                suggestedImprovements: v.array(v.string()),
            }),
            helpfulInsights: v.object({
                matchedPhrases: v.array(v.string()),
                sentimentComparison: v.array(v.string()),
                suggestedPhrases: v.array(v.string()),
            }),
            matchedKeywords: v.array(v.string()),
            skillSetAnalysis: v.array(v.string()),
            spellingMistakes: v.array(v.object({
                correct: v.string(),
                incorrect: v.string(),
            })),
            suggestedKeywords: v.array(v.string()),
        }),
    },

    handler: async (ctx, args) => {
        // Fetch the existing document by userId
        const existingDocument = await ctx.db.query("pdfs")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .first();

        if (!existingDocument) {
            return { success: false, message: "Document not found" };
        }

        // Cast existingDocument.file to FileType[]
        const files: FileType[] = existingDocument.file as FileType[];

        // Find the file to update based on fileId
        const fileToUpdate = files.find(file => file.fileId === args.fileId);

        if (!fileToUpdate) {
            return { success: false, message: "File not found" };
        }

        // Update the formattedText for the specific file
        fileToUpdate.formattedText = args.formattedText;

        // Patch the document with the updated file array
        await ctx.db.patch(existingDocument._id, {
            file: existingDocument.file,
        });

        return { success: true, message: "Formatted text updated successfully", id: existingDocument._id };
    }
});

export const getPdfDetailsByUserId = query({
    args: {
        userId: v.string(),
    },

    handler: async (ctx, args) => {
        const result = await ctx.db.query("pdfs")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .order("desc")
            .collect();

        return result
    }
})

export const getPdfDetailsByFileId = query({
    args: {
        fileId: v.string(),
    },

    handler: async (ctx, args) => {
        const documents = await ctx.db.query("pdfs")
            .collect();
        // Loop through each document and search for the file by fileId
        for (const document of documents) {
            if (document.file && Array.isArray(document.file)) {
                // console.log("Files in document: ", document.file);
                // Looking for the file that matches the fileId
                const pdfDetails = document.file.find((file: FileType) => {
                    // console.log("Comparing fileId: ", file.fileId, " with args.fileId: ", args.fileId);  // Debug comparison
                    return String(file.fileId) === String(args.fileId);  // Ensure correct type comparison
                });
                if (pdfDetails) {
                    // Found matching file, return its details
                    // console.log("pdfDetails: ", pdfDetails);  // Debug output of found pdf details
                    return pdfDetails;
                }
            }
        }
        // If no matching file is found, return null
        return null;
    }
});

export const deletePdfByFileId = mutation({
    args: {
        fileId: v.string(),
    },

    handler: async (ctx, args) => {
        // Fetch all documents from the "pdfs" collection
        const documents = await ctx.db.query("pdfs").collect();

        // Iterate through each document to find the one containing the target fileId
        for (const document of documents) {
            // Check if the file array includes the file with the specified fileId
            const fileIndex = (document.file as FileType[]).findIndex(
                (file) => file.fileId === args.fileId
            );

            // If the file is found, proceed with deletion
            if (fileIndex !== -1) {
                const updatedFileArray = [
                    ...document.file.slice(0, fileIndex),
                    ...document.file.slice(fileIndex + 1),
                ];

                // Update the document with the modified file array
                await ctx.db.patch(document._id, {
                    file: updatedFileArray,
                });

                return { success: true, message: "File deleted successfully." };
            }
        }

        // If the fileId is not found, return an error response
        return { success: false, message: "File not found." };
    },
});