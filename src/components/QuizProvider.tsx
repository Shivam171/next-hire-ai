"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type QuizProgress = {
    answeredQuestions: number;
    correctAnswers: number;
    helpUsed: number;
    totalQuestions: number;
    isCompleted: boolean;
};

type QuizContextType = {
    quizProgress: QuizProgress;
    setQuizProgress: React.Dispatch<React.SetStateAction<QuizProgress>>;
    isGenerating: boolean;
    setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultQuizProgress: QuizProgress = {
    answeredQuestions: 0,
    correctAnswers: 0,
    helpUsed: 0,
    totalQuestions: 0,
    isCompleted: false,
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
    const [quizProgress, setQuizProgress] = useState<QuizProgress>(defaultQuizProgress);
    const [isGenerating, setIsGenerating] = useState(false);

    return (
        <QuizContext.Provider value={{ quizProgress, setQuizProgress, isGenerating, setIsGenerating }}>
            {children}
        </QuizContext.Provider>
    );
};

export const useQuizContext = (): QuizContextType => {
    const context = useContext(QuizContext);
    if (!context) {
        throw new Error("useQuizContext must be used within a QuizProvider");
    }
    return context;
};
