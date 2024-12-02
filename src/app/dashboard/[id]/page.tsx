"use client"
import { useRouter } from "next/navigation";
import { useConvex, useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import AiResponse from "@/components/AiResponse";
import Chart from "@/components/Chart";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Quiz from "@/components/Quiz";
import NavigationButtons from "@/components/NavigationButtons";
import { useAuth, SignOutButton } from '@clerk/clerk-react';
import useLoadingMessages from '@/lib/hooks/useLoadingMessages';
import { FormattedText, FileIdProp, Tabs } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function Dashboard({ params: { id } }: FileIdProp) {
    const { userId } = useAuth();
    const convex = useConvex();
    const router = useRouter();
    const [rawText, setRawText] = useState<string>("");
    const [jobDescription, setJobDescription] = useState<string>("");
    const [formattedText, setFormattedText] = useState<FormattedText | undefined>(undefined);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [onError, setOnError] = useState<boolean>(false);
    const [tabs, setTabs] = useState<Tabs>({
        overview: true,
        quiz: false,
    });
    const updatePdf = useMutation(api.pdfs.updateFormattedTextDetails);

    // Verify user is logged in
    useEffect(() => {
        if (!userId) {
            router.push("/sign-in");
        }
    }, [userId, router]);

    // Get file details from Convex using file id
    const getPDFDetails = useCallback(async () => {
        try {
            const result = await convex.query(api.pdfs.getPdfDetailsByFileId, {
                fileId: id,
            });
            // If no result or invalid ID
            if (!result) {
                router.push("/main");
            } else {
                setRawText(result?.rawText);
                setFormattedText(result?.formattedText);
            }
        } catch (error) {
            toast("Unable to fetch PDF details, Try uploading again");
            console.log("Error fetching PDF details: ", error);
            router.push("/main");
        }
    }, [convex, id, router]);

    // Check if params id is valid then get current file details
    useEffect(() => {
        if (id) {
            getPDFDetails();
        } else {
            router.push("/main");
        }
    }, [id, getPDFDetails, router]);

    // Define loading messages
    const loadingMessages = [
        "Please wait...",
        "Analyzing CV...",
        "Checking for spelling mistakes...",
        "This might take a few seconds...",
        "Checking for keywords...",
        "Comparing skill sets...",
        "Suggesting helpful insights...",
        "Calculating compatibility score..."
    ];

    const currentMessage: string = useLoadingMessages(loadingMessages, isFetching, 1500);

    const handleTabSwitch: () => void = () => {
        setTabs({
            overview: !tabs.overview,
            quiz: !tabs.quiz
        })
    }

    // Get the raw text and job description from user input 
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // If JD is not provided by the user
        if (!jobDescription.trim()) {
            toast("Please enter a job description");
            return;
        }
        setOnError(false);
        setIsFetching(true);
        // Send the jobDescription and rawText to the API
        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jobDescription, rawText }),
            })
            const result = await response.json();

            if (!response.ok) {
                toast(result.message);
            }
            toast(result.message);

            // Saving result?.data to Convex
            await updatePdf({
                userId: userId!,
                fileId: id,
                formattedText: result?.data
            })

            // Fetch updated file details
            getPDFDetails();

        } catch (error) {
            console.log("Error: ", error);
            toast("Something went wrong, please try again.");
            setOnError(true)
        } finally {
            setIsFetching(false)
        }

        // Clear the form
        setJobDescription('');
    }

    return (
        <div className="min-h-screen flex flex-col gap-4 p-4">
            {tabs.overview && (
                <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                    <Input
                        type="text"
                        id="jobDescription"
                        name="jobDescription"
                        placeholder="Enter your job description"
                        className="focus:ring-1 focus:ring-ring/50 shadow-sm"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    />
                    <Button
                        disabled={isFetching}
                        aria-busy={isFetching}
                        className="flex items-center"
                    >
                        {isFetching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Analyze"}
                    </Button>
                    <SignOutButton>
                        <Button
                            type="button"
                            variant={"outline"}
                        >
                            Logout
                        </Button>
                    </SignOutButton>
                </form>
            )}
            <div className="grow flex flex-col gap-2">
                {/* Navigation Buttons */}
                <NavigationButtons
                    userId={userId!}
                    handleTabSwitch={handleTabSwitch}
                    tabs={tabs}
                    formattedText={formattedText!}
                />
                {/* Results */}
                <div className="grow flex h-full border border-gray-300 rounded-md p-4 shadow-sm">
                    {isFetching ? (
                        <div className="bg-gray-50 border-dashed border-2 rounded-md flex flex-col gap-4 items-center justify-center w-full">
                            <Image
                                src="/let-me-check.gif"
                                height={200}
                                width={200}
                                alt="loading"
                                className="grayscale"
                            />
                            <p className="mt-2 text-sm text-slate-500">
                                {currentMessage}
                            </p>
                        </div>
                    ) : formattedText && !onError ? (
                        <>
                            {tabs.overview && (
                                <div className="grid gap-2 grid-cols-1 lg:grid-cols-[6fr_4fr] w-full overflow-hidden">
                                    <div className="relative overflow-hidden">
                                        <AiResponse formattedText={formattedText} />
                                    </div>
                                    {/* Chart */}
                                    <div className="border border-gray-300 rounded-md p-4 shadow-sm">
                                        <Chart formattedText={formattedText} />
                                    </div>
                                </div>
                            )}
                            {tabs.quiz && (
                                <div className="grid grid-cols-1 w-full overflow-hidden">
                                    <Quiz />
                                </div>
                            )}
                        </>
                    ) : onError ? (
                        <div className="bg-gray-50 border-dashed border-2 rounded-md flex flex-col gap-4 items-center justify-center w-full">
                            <Image
                                src="/something-wrong.gif"
                                height={250}
                                width={250}
                                alt="loading"
                                className="grayscale rounded-md"
                            />
                            <h2 className="text-black font-semibold">An error occurred !, Please refresh the page or try again later.</h2>
                        </div>
                    ) : (
                        <div className="bg-gray-50 border-dashed border-2 rounded-md flex flex-col gap-4 items-center justify-center w-full">
                            <Image
                                src="/chill.gif"
                                height={150}
                                width={150}
                                loading="lazy"
                                alt="loading"
                                className="grayscale"
                            />
                            {tabs.overview ? (
                                <p className="text-sm text-slate-500 px-4 text-center">Submit a job description to begin.</p>
                            ) : (
                                <p className="text-sm text-slate-500 px-4 text-center">Submit a job description in the &quot;Overview&quot; tab to get started.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
