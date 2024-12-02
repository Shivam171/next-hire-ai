"use client"
import { uploadToFirebase } from "@/lib/uploadToFirebase"
import { Inbox, Loader2, Check } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useConvex } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useAuth } from '@clerk/clerk-react';

export default function FileUpload() {
    const { userId } = useAuth();
    const convex = useConvex();
    const router = useRouter();
    const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success'>('idle');
    const addPdf = useMutation(api.pdfs.addPdfDetails);

    const { getRootProps, getInputProps } = useDropzone({
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 1,
        // Completely disable dropzone when uploading or success
        noClick: uploadState !== 'idle',
        noKeyboard: uploadState !== 'idle',
        disabled: uploadState !== 'idle',
        onDrop: async (acceptedFiles) => {
            // Prevent any drop if not in idle state
            if (uploadState !== 'idle') return;

            // console.log("File accepted", acceptedFiles);
            const file = acceptedFiles[0];

            // Check if the file is larger than 2MB
            if (file.size > 2 * 1024 * 1024) {
                toast("File is too large (> 2MB)");
                return;
            }

            try {
                setUploadState('uploading');

                // Upload file to Firebase
                const data = await uploadToFirebase(file);
                const fileUrl = data?.fileUrl;

                // Proceed only if the file URL is valid
                if (!fileUrl) {
                    throw new Error('Invalid file URL');
                }

                // Make a POST request to your API to extract PDF text
                const response = await fetch('/api/extract', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ pdfUrl: fileUrl }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Failed to extract PDF contents', errorData);
                    throw new Error('PDF extraction failed');
                }

                const responseData = await response.json();

                // Fetch existing pdf details by userId
                const existingPdf = await convex.query(api.pdfs.getPdfDetailsByUserId, {
                    userId: userId || "",
                })
                let updatedFileArray;
                if (existingPdf && existingPdf.length > 0) {
                    // If user has existing files, add to the file array
                    updatedFileArray = [
                        ...existingPdf[0].file,
                        {
                            fileId: data?.fileId || "",
                            fileName: data?.fileName || "",
                            fileUrl: fileUrl,
                            rawText: responseData?.text,
                        }
                    ];
                } else {
                    // If new user, initialize the file array with this file
                    updatedFileArray = [
                        {
                            fileId: data?.fileId || "",
                            fileName: data?.fileName || "",
                            fileUrl: fileUrl,
                            rawText: responseData?.text,
                        }
                    ];
                }

                // Save updated or new file details to Convex
                const res = await addPdf({
                    userId: userId || "",
                    file: updatedFileArray,
                });

                if (res) {
                    // Show success state
                    setUploadState('success');

                    // Delay redirection to show success state
                    setTimeout(() => {
                        router.push(`/dashboard/${data?.fileId}`);
                    }, 1500);
                }
            } catch (error) {
                console.error('Error during file upload or extraction:', error);
                toast.error("Upload failed. Please try again.");
                setUploadState('idle');
            }
        }
    });

    return (
        <div className="p-2 bg-white rounded-xl">
            <div
                {...getRootProps({
                    className: "py-8 flex flex-col justify-center items-center border-2 bg-gray-50 cursor-pointer border-dashed rounded-xl",
                })}
            >
                <input {...getInputProps()} />
                {uploadState === 'uploading' && (
                    <>
                        <Loader2 className="w-10 h-10 animate-spin text-gray-800" />
                        <p className="mt-2 text-sm text-slate-400">Dropping your resume...</p>
                    </>
                )}
                {uploadState === 'success' && (
                    <>
                        <Check className="w-10 h-10 text-green-500" />
                        <p className="mt-2 text-sm text-green-500">Resume uploaded successfully. Redirecting...</p>
                    </>
                )}
                {uploadState === 'idle' && (
                    <>
                        <Inbox className="w-10 h-10 text-gray-800" />
                        <p className="">Drop or select your resume</p>
                    </>
                )}
            </div>
        </div>
    )
}