import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import Image from "next/image";
import { toast } from "sonner";
import useLoadingMessages from '@/lib/hooks/useLoadingMessages';
import MCQ from './MCQ';
import { useQuizContext } from './QuizProvider';
import { MCQProps } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from './ui/dialog';

export default function Quiz() {
    const [onError, setOnError] = useState(false);
    const [generatedQuiz, setGeneratedQuiz] = useState<MCQProps[][]>();
    const { isGenerating, setIsGenerating, setQuizProgress } = useQuizContext();
    const [openDialog, setOpenDialog] = useState(false);
    const [userJobDescription, setUserJobDescription] = useState('');

    // Handle job description change in the dialog
    const handleJobDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserJobDescription(event.target.value);
    };

    const handleTakeQuiz = async () => {
        if (!userJobDescription) {
            toast("Please provide a job description to proceed.");
            return;
        }
        setIsGenerating(true);
        try {
            const response = await fetch('/api/quiz-test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jobDescription: userJobDescription }),
            })
            const result = await response.json();
            // console.log("Result: ", result);
            if (!response.ok) {
                toast(result.message);
                throw new Error(result.message);
            }
            toast(result.message);
            const quizQuestions = result?.data?.[0];

            if (Array.isArray(quizQuestions)) {
                setGeneratedQuiz([quizQuestions]);
                setQuizProgress((prev) => ({
                    ...prev,
                    totalQuestions: quizQuestions.length,
                    isCompleted: false,
                }));
            } else {
                toast("Quiz data is invalid or empty.");
                setOnError(true);
            }
        } catch (error) {
            console.log("Error: ", error);
            toast("Something went wrong, please try again.");
            setOnError(true)
        } finally {
            setIsGenerating(false)
            setOpenDialog(false)
        }
    }

    // Define loading messages
    const loadingMessages = [
        "Relax, let our ai do the work...",
        "Analyzing Job Description...",
        "Checking for skillset...",
        "Generating quiz...",
    ];

    const currentMessage: string = useLoadingMessages(loadingMessages, isGenerating, 2000);

    return (
        <div className="bg-gray-50 rounded-md border-2 border-gray-300 border-dashed">
            <div className="flex flex-col justify-center items-center h-full">
                {isGenerating ? (
                    <div className="flex flex-col gap-4 items-center justify-center w-full h-full">
                        <Image
                            src="/relax.gif"
                            height={200}
                            width={200}
                            alt="loading"
                            className="grayscale"
                        />
                        <p className="mt-2 text-sm text-slate-500">
                            {currentMessage}
                        </p>
                    </div>
                ) : generatedQuiz && !onError ? (
                    <>
                        <MCQ
                            generatedQuiz={generatedQuiz}
                        />
                    </>
                ) : onError ? (
                    <div className="flex flex-col gap-4 items-center justify-center w-full">
                        <Image
                            src="/something-wrong.gif"
                            height={250}
                            width={250}
                            alt="loading"
                            className="grayscale rounded-md"
                        />
                        <h2 className="mt-2 text-sm text-slate-500">An error occurred ! Server might be down. Please go back in overview and try again.</h2>
                    </div>
                ) : (
                    <>
                        <h1 className='text-3xl md:text-5xl font-semibold mb-3'>NextHireAI{" "}<span className='bg-black text-white px-2 py-1 rounded-md'>Quiz</span></h1>
                        <h3 className='text-sm md:text-md'>Not user if you&apos;re confident for interview ?</h3>
                        <p className='text-gray-400 text-xs px-4 md:p-0 md:text-sm mb-4 text-center'>Try our ✨ AI powered quiz. Practice and improve your interview skills.</p>
                        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                            <DialogTrigger asChild>
                                <Button type="button" onClick={() => setOpenDialog(true)}>
                                    Take Quiz
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle>Enter Your Job Description</DialogTitle>
                                <DialogDescription>Please provide a brief description of the job you&apos;re preparing for.</DialogDescription>
                                <input
                                    type="text"
                                    value={userJobDescription}
                                    onChange={handleJobDescriptionChange}
                                    placeholder="Job description..."
                                    className="w-full border border-gray-300 p-2 rounded-md"
                                />
                                <div className="flex justify-end mt-4">
                                    <Button onClick={handleTakeQuiz} disabled={!userJobDescription}>
                                        Start Quiz
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </>
                )}
            </div>
        </div>
    )
}
