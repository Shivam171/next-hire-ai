"use client"
import { CloudUpload, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";
import { useMutation, useConvex } from "convex/react"
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import SendToRecruiter from "./SendToRecruiter";
import ResumeHistory from "./ResumeHistory";
import { FormattedText, Tabs, Items } from "@/lib/types";
import { useQuizContext } from "./QuizProvider";

interface MainButtonsProps {
    tabs: Tabs;
    resumeHistory: Items[];
    formattedText: FormattedText;
    handleResumeDelete: (fileId: string) => void;
    router: ReturnType<typeof useRouter>;
}

export const MainButtons = ({ tabs, resumeHistory, formattedText, handleResumeDelete, router }: MainButtonsProps) => {
    return (
        <>
            {tabs.overview && (
                <>
                    <ResumeHistory resumeHistory={resumeHistory} handleResumeDelete={handleResumeDelete} />
                    <Button type="button" onClick={() => router.push(`/main`)} variant={"outline"} className="px-5 h-9 text-sm">
                        <CloudUpload className="w-5 h-5" />
                        Upload Again
                    </Button>
                    {formattedText && (
                        <>
                            {/* <Button type="button" variant={"outline"} className="px-5 h-9 text-sm">
                                <Download className="w-5 h-5" />
                                Download Report
                            </Button> */}
                            <SendToRecruiter />
                        </>
                    )}
                </>
            )}
        </>
    )
}

export default function NavigationButtons({
    userId,
    handleTabSwitch,
    tabs,
    formattedText
}: {
    userId: string,
    handleTabSwitch: () => void,
    tabs: Tabs,
    formattedText: FormattedText,
}) {
    const router = useRouter();
    const convex = useConvex();
    const { quizProgress, isGenerating } = useQuizContext();
    const [resumeHistory, setResumeHistory] = useState([]);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const deletePdf = useMutation(api.pdfs.deletePdfByFileId);

    const getAllFiles = useCallback(async () => {
        try {
            const result = await convex.query(api.pdfs.getPdfDetailsByUserId, {
                userId: userId!,
            });
            setResumeHistory(result[0].file);

        } catch (error) {
            console.log("An error occurred while fetching files:", error);
            toast("An error occurred while fetching files.");
        }
    }, [convex, userId]);

    useEffect(() => {
        getAllFiles();
    }, [getAllFiles])

    const handleResumeDelete = async (fileId: string) => {
        try {
            await deletePdf({ fileId: fileId });
            toast("Resume deleted successfully");
            getAllFiles();
        } catch (error) {
            console.log("An error occurred while deleting the file:", error);
            toast("An error occurred while deleting the file.");
        }
    }

    const handleOverviewClick = () => {
        if (isGenerating || !quizProgress.isCompleted && quizProgress.answeredQuestions < quizProgress.totalQuestions) {
            setShowDialog(true);
        } else {
            handleTabSwitch();
        }
    };

    return (
        <div className="flex justify-between items-center">
            {/* Overview and Quiz Switch Tabs Button */}
            <div className="flex text-sm font-semibold items-center bg-[#F4F4F5] w-fit gap-2 px-1 py-1 rounded-lg transition-colors">
                <div
                    className={`px-2 py-1 rounded-md cursor-pointer transition-all ease-linear ${tabs.overview ? 'bg-white' : 'text-gray-500 hover:text-gray-900'}  `}
                    onClick={handleOverviewClick}
                >
                    Overview
                </div>
                {formattedText && (
                    <div
                        className={`px-2 py-1 rounded-md cursor-pointer transition-all ease-linear ${tabs.quiz ? 'bg-white' : 'text-gray-500 hover:text-gray-900'}  `}
                        onClick={handleTabSwitch}
                    >
                        Quiz
                    </div>
                )}
            </div>
            {/* large screen menu */}
            <div className="hidden lg:flex gap-2 items-center">
                <MainButtons
                    router={router}
                    tabs={tabs}
                    resumeHistory={resumeHistory}
                    formattedText={formattedText}
                    handleResumeDelete={handleResumeDelete}
                />
            </div>
            {/* mobile menu */}
            {tabs.overview && (
                <div className="lg:hidden flex gap-2 items-center">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60 flex flex-col gap-2">
                            <MainButtons
                                router={router}
                                tabs={tabs}
                                resumeHistory={resumeHistory}
                                formattedText={formattedText}
                                handleResumeDelete={handleResumeDelete}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            )}
            {/* Dialog for quiz in progress */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Quiz In Progress</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-gray-600">
                        Please complete the quiz before switching back to the Overview tab.
                    </p>
                    <DialogFooter>
                        <Button onClick={() => setShowDialog(false)}>Okay</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
