import React from 'react'
import { SpellCheck, NotebookText, MessageSquareText, BrainCog, Rocket, Clipboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { FormattedText, SpellingMistake } from '@/lib/types';
export default function AiResponse({ formattedText }: { formattedText: FormattedText }) {
    
    const handleCopy = (data: string | string[] | SpellingMistake[], text: string) => {
        if (typeof data === 'string') {
            navigator.clipboard.writeText(data);
        } else if (Array.isArray(data)) {
            if (text === "matchedKeywords" || text === "suggestedKeywords") {
                navigator.clipboard.writeText(data.join(', '));
            } else if (text === "spellingMistakes") {
                const formatData = (data as SpellingMistake[]).map(mistake => `${mistake.incorrect} -> ${mistake.correct}`).join('\n');
                navigator.clipboard.writeText(formatData);
            } else if (text === "skillSetAnalysis") {
                navigator.clipboard.writeText(data.join('\n'));
            } else if (text === "helpfulInsights") {
                navigator.clipboard.writeText(data.join(', '));
            }
        }
        toast("Copied to clipboard");
    };


    return (
        <div className="flex flex-col gap-3">
            {/* Spelling Mistakes */}
            <div className="border border-gray-300 rounded-md shadow-sm p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <h2 className="flex items-center gap-2 text-[16px] font-semibold"><NotebookText className="w-5 h-5" />Spelling Mistakes</h2>
                    <Clipboard
                        className="w-4 h-4 transition-colors text-gray-600 hover:text-gray-800 cursor-pointer"
                        onClick={() => handleCopy(formattedText.spellingMistakes, "spellingMistakes")}
                    />
                </div>
                <div className="flex flex-wrap font-normal gap-2">
                    {formattedText.spellingMistakes.length === 0 && (
                        <p className="text-sm">
                            No spelling mistakes found
                        </p>
                    )}

                    {formattedText.spellingMistakes.map((mistake, index) => (
                        <Badge key={index} variant="outline" className="w-fit">{mistake.incorrect} {"->"} {mistake.correct}</Badge>
                    ))}
                </div>
            </div>
            {/* Matched and Unmatched Keywords */}
            <div className="grid gap-2 grid-cols-1 lg:grid-cols-2">
                {/* Matched Keywords */}
                <div className="border border-gray-300 rounded-md shadow-sm p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <h2 className="flex items-center gap-2 text-[16px] font-semibold"><SpellCheck className="w-5 h-5" />Matched Keywords</h2>
                        <Clipboard
                            className="w-4 h-4 transition-colors text-gray-600 hover:text-gray-800 cursor-pointer"
                            onClick={() => handleCopy(formattedText.matchedKeywords, "matchedKeywords")}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formattedText.matchedKeywords.map((keyword, index) => (
                            <Badge key={index} variant="outline" className="w-fit">{keyword}</Badge>
                        ))}
                    </div>
                </div>
                {/* Suggested Keywords */}
                <div className="border border-gray-300 rounded-md shadow-sm p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                        <h2 className="flex items-center gap-2 text-[16px] font-semibold"><MessageSquareText className="w-5 h-5" />Suggested Keywords</h2>
                        <Clipboard
                            className="w-4 h-4 transition-colors text-gray-600 hover:text-gray-800 cursor-pointer"
                            onClick={() => handleCopy(formattedText.suggestedKeywords, "suggestedKeywords")}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formattedText.suggestedKeywords.map((keyword, index) => (
                            <Badge key={index} variant="outline" className="w-fit">{keyword}</Badge>
                        ))}
                    </div>
                </div>
            </div>
            {/* Skill Set Results */}
            <div className="border border-gray-300 rounded-md shadow-sm p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <h2 className="flex items-center gap-2 text-[16px] font-semibold"><Rocket className="w-5 h-5" />Skillset Analysis</h2>
                    <Clipboard
                        className="w-4 h-4 transition-colors text-gray-600 hover:text-gray-800 cursor-pointer"
                        onClick={() => handleCopy(formattedText.skillSetAnalysis, "skillSetAnalysis")}
                    />
                </div>
                <ul className="list-decimal list-inside text-sm space-y-2 ml-[0.5em]">
                    {formattedText.skillSetAnalysis.map((skill, index) => (
                        <li key={index}>{skill}</li>
                    ))}
                </ul>
            </div>
            {/* Helpful Insights */}
            <div className="border border-gray-300 rounded-md shadow-sm p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <h2 className="flex items-center gap-2 text-[16px] font-semibold"><BrainCog className="w-5 h-5" />Helpful Insights</h2>
                    <Clipboard
                        className="w-4 h-4 transition-colors text-gray-600 hover:text-gray-800 cursor-pointer"
                        onClick={() => {
                            const sentimentComparison = formattedText.helpfulInsights.sentimentComparison.join('\n')
                            const matchedPhrases = formattedText.helpfulInsights.matchedPhrases.join(', ')
                            const suggestedPhrases = formattedText.helpfulInsights.suggestedPhrases.join('\n')
                            const helpfulInsights = `Sentiment Analysis:\n${sentimentComparison}\nMatched Phrases:\n${matchedPhrases}\nSuggested Phrases:\n${suggestedPhrases}`
                            handleCopy([helpfulInsights], "helpfulInsights");
                        }}
                    />
                </div>
                <div className="">
                    <p className="text-sm font-semibold">Sentiment Analysis:</p>
                    <ul className="list-decimal list-inside text-sm m-2 space-y-2">
                        {formattedText.helpfulInsights.sentimentComparison.map((insight, index) => (
                            <li key={index}>{insight}</li>
                        ))}
                    </ul>
                </div>
                <div className="">
                    <p className="text-sm font-semibold">Matched Phrases:</p>
                    <div className="flex flex-wrap font-normal gap-2 m-2 pl-2">
                        {formattedText.helpfulInsights.matchedPhrases.map((matchedPhrase, index) => (
                            <Badge key={index} variant="outline" className="w-fit">{matchedPhrase}</Badge>
                        ))}
                    </div>
                </div>
                <div className="">
                    <p className="text-sm font-semibold">Suggested Phrases:</p>
                    <ul className="list-decimal list-inside text-sm m-2 space-y-2">
                        {formattedText.helpfulInsights.suggestedPhrases.map((suggestedPhrase, index) => (
                            <li key={index}>{suggestedPhrase}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
