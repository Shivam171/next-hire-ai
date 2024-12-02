import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BadgeHelp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import materialDark from "react-syntax-highlighter/dist/esm/styles/prism/material-dark";
import { useQuizContext } from "./QuizProvider";
import { MCQProps } from "@/lib/types";

export default function MCQ({ generatedQuiz }: { generatedQuiz: MCQProps[][] }) {
    const questions = generatedQuiz[0]; // Access the inner array directly

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showHelp, setShowHelp] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isQuizCompleted, setIsQuizCompleted] = useState(false);

    // Access the QuizContext
    const { quizProgress, setQuizProgress } = useQuizContext();

    if (!questions || questions.length === 0) {
        return <p>No questions available.</p>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    // Handle option selection
    const handleOptionSelect = (optionKey: string) => {
        setSelectedOption(optionKey);
        setShowHelp(false);
    };

    // Handle "Next" button click
    const handleNext = () => {
        // Update quiz progress for answered questions
        setQuizProgress((prev) => ({
            ...prev,
            answeredQuestions: prev.answeredQuestions + 1,
        }));

        // Check if the selected option is correct
        if (selectedOption === currentQuestion.correctOption) {
            setQuizProgress((prev) => ({
                ...prev,
                correctAnswers: (prev.correctAnswers || 0) + 1, // Optional: Track correct answers
            }));
        }

        // Reset for next question
        setSelectedOption(null);
        setShowHelp(false);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Mark quiz as completed
            setQuizProgress((prev) => ({ ...prev, isCompleted: true }));
            setIsQuizCompleted(true);
        }
    };

    // Handle "Back" button click
    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setSelectedOption(null);
            setShowHelp(false);

            // Adjust quiz progress on going back
            setQuizProgress((prev) => ({
                ...prev,
                answeredQuestions: prev.answeredQuestions - 1,
            }));
        }
    };

    // Handle "Need Help" button click
    const handleNeedHelp = () => {
        setShowHelp(true);

        // Track help usage in quiz progress
        setQuizProgress((prev) => ({
            ...prev,
            helpUsed: (prev.helpUsed || 0) + 1, // Optional: Track help usage
        }));
    };

    // Quiz completion view
    if (isQuizCompleted) {
        return (
            <div className="flex flex-col gap-4 w-full h-full items-center justify-center py-4">
                <h2 className="text-2xl font-semibold">Quiz Results</h2>
                <p>Total Questions: {questions.length}</p>
                <p>Correct Answers: {quizProgress.correctAnswers || 0}</p>
                <p>Incorrect Answers: {questions.length - (quizProgress.correctAnswers || 0)}</p>
                <p>Help Used: {quizProgress.helpUsed || 0}</p>
                <Button type="button" onClick={() => window.location.reload()}>
                    Retry Quiz
                </Button>
            </div>
        );
    }

    // Active quiz view
    return (
        <div className="flex flex-col gap-4 w-full h-full items-center justify-center py-4">
            <div className="flex flex-col items-center justify-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-semibold">
                    NextHireAi <span className="bg-black text-white px-2 py-1 rounded-md">Quiz</span>
                </h1>
                <p className="text-xs sm:text-sm px-4 text-center text-gray-500">
                    Below are some questions to test your knowledge as per the job you are trying to apply for.
                </p>
            </div>
            <div className="transition-colors mt-2 px-4 flex flex-col items-center justify-center">
                <div className="w-[300px] sm:w-[550px] md:w-[600px] lg:w-[800px]">
                    <div className="text-sm sm:text-[16px] font-medium mb-2">
                        <ReactMarkdown
                            components={{
                                code({ className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || "");
                                    return match ? (
                                        <SyntaxHighlighter
                                            style={materialDark}
                                            language={match[1]}
                                            PreTag="div"
                                            {...(props as any)}
                                        >
                                            {String(children).replace(/\n$/, "")}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code className={className} {...(props as any)}>
                                            {children}
                                        </code>
                                    );
                                },
                            }}
                        >
                            {currentQuestion.question}
                        </ReactMarkdown>;
                    </div>
                    <div className="flex flex-col gap-4 text-sm sm:text-lg">
                        {Object.entries(currentQuestion.options).map(([key, optionText]) => (
                            <div
                                key={key}
                                onClick={() => handleOptionSelect(key)}
                                className={`rounded-md p-3 cursor-pointer ${selectedOption === key
                                    ? key === currentQuestion.correctOption
                                        ? "bg-green-300"
                                        : "bg-red-300"
                                    : "bg-gray-200 hover:bg-gray-300"
                                    }`}
                            >
                                {key.toUpperCase()}) {optionText}
                            </div>
                        ))}
                    </div>
                    <div className="w-full flex justify-between mt-6">
                        {currentQuestionIndex > 0 && (
                            <Button type="button" variant="outline" className="px-5 h-9" onClick={handleBack}>
                                Back
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            className="px-5 h-9 flex items-center"
                            onClick={handleNeedHelp}
                        >
                            <span>Need Help</span>
                            <BadgeHelp className="w-5 h-5" />
                        </Button>
                        <Button
                            type="button"
                            className="px-5 h-9"
                            onClick={handleNext}
                        >
                            {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"}
                        </Button>
                    </div>
                    <div className="text-center text-xs mt-6">
                        <b>{currentQuestionIndex + 1}</b> of <b>{questions.length}</b>
                    </div>
                    {showHelp && (
                        <div className="text-sm sm:text-md bg-gray-900 text-white rounded-md mt-6 p-4">
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-2">
                                    <p className="font-semibold">Correct Answer:</p>
                                    <p>{currentQuestion.correctOption.toUpperCase()}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="font-semibold">Explanation</p>
                                    <p className="text-sm">{currentQuestion.explanation}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
