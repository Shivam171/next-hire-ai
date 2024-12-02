// File id types
export type FileIdProp ={
    params: {
        id: string;
    };
}

// PDF types
export type FileType = {
    fileId: string;
    fileName: string;
    fileUrl: string;
    rawText: string;
    formattedText?: {
        combinedScore: {
            keywordMatchScore: string;
            overallScore: string;
            skillsetMatchScore: string;
            suggestedImprovements: string[];
        };
        helpfulInsights: {
            matchedPhrases: string[];
            sentimentComparison: string[];
            suggestedPhrases: string[];
        };
        matchedKeywords: string[];
        skillSetAnalysis: string[];
        spellingMistakes: {
            correct: string;
            incorrect: string;
        }[];
        suggestedKeywords: string[];
    };
    jobDescription?: string;
    creationTime?: number;
};

// Result History types
export interface FormattedText {
    spellingMistakes: SpellingMistake[];
    skillSetAnalysis: string[];
    helpfulInsights: HelpfulInsights;
    combinedScore: CombinedScore;
    matchedKeywords: string[];
    suggestedKeywords: string[];
}

interface CombinedScore {
    keywordMatchScore: string;
    skillsetMatchScore: string;
    overallScore: string;
    suggestedImprovements: string[];
}

interface HelpfulInsights {
    sentimentComparison: string[];
    matchedPhrases: string[];
    suggestedPhrases: string[];
}

export interface SpellingMistake {
    incorrect: string;
    correct: string;
}

// Resume History types
export type Items = {
    fileId: string;
    fileName: string;
    fileUrl: string;
    creationTime: number;
}

// Tab types
export interface Tabs {
    overview: boolean;
    quiz: boolean;
}


export type MCQProps = {
    question: string;
    options: {
        a: string;
        b: string;
        c: string;
        d: string;
    };
    correctOption: string;
    explanation: string;
};


export interface RecruiterType {
    _id: string;
    userId: string;
    name: string;
    role: string;
    company: string;
    profileImage?: string;
    resumeUrl?: string;
    message?: object;
}