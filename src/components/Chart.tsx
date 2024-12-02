import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Plugin } from 'chart.js';
import { HandHelping, Clipboard } from 'lucide-react';
import { toast } from 'sonner';
import { FormattedText } from '@/lib/types';

ChartJS.register(ArcElement);

// Center text for the overall score
const centerTextPlugin: Plugin<"doughnut"> = {
    id: 'centerText',
    afterDraw: (chart) => {
        const { ctx, chartArea: { left, top, width, height } } = chart;
        ctx.save();
        const text = `${chart.data.datasets[0].data[0]}%`;
        ctx.font = 'bold 25px sans-serif';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, left + width / 2, top + height / 2);
        ctx.restore();
    },
};


// Larger center text for the overall score
const largerCenterTextPlugin: Plugin<"doughnut"> = {
    id: 'largerCenterText',
    afterDraw: (chart) => {
        const { ctx, chartArea: { left, top, width, height } } = chart;
        ctx.save();
        const text = `${chart.data.datasets[0].data[0]}%`;
        ctx.font = 'bold 48px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, left + width / 2, top + height / 2);
        ctx.restore();
    },
};

// Color function to determine colors based on score
const getColors = (score: number) => {
    if (score <= 50) {
        // Red to Orange gradient for 0-50%
        const gradientIntensity = (score / 50); // 0 to 1
        return {
            backgroundColor: [
                `rgb(255, ${Math.round(140 * gradientIntensity)}, 0)`, // Red to Orange
                "rgb(39, 46, 63)" // Background color
            ],
            borderColor: [
                `rgb(255, ${Math.round(140 * gradientIntensity)}, 0)`,
                "rgb(39, 46, 63)"
            ]
        };
    } else if (score <= 75) {
        return {
            backgroundColor: [
                "rgb(255, 140, 0)", // Orange
                "rgb(39, 46, 63)"
            ],
            borderColor: [
                "rgb(255, 140, 0)",
                "rgb(39, 46, 63)"
            ]
        };
    } else if (score <= 90) {
        // Orange to Green gradient for 75-90%
        const gradientIntensity = (score - 75) / 15; // 0 to 1
        const red = Math.round(255 * (1 - gradientIntensity));
        const green = Math.round(140 + (115 * gradientIntensity));
        return {
            backgroundColor: [
                `rgb(${red}, ${green}, 0)`,
                "rgb(39, 46, 63)"
            ],
            borderColor: [
                `rgb(${red}, ${green}, 0)`,
                "rgb(39, 46, 63)"
            ]
        };
    } else {
        // Solid Green for 90-100%
        return {
            backgroundColor: [
                "rgb(0, 255, 0)", // Full Green
                "rgb(39, 46, 63)"
            ],
            borderColor: [
                "rgb(0, 255, 0)",
                "rgb(39, 46, 63)"
            ]
        };
    }
};

export default function Chart({ formattedText }: { formattedText: FormattedText }) {
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1,
        cutout: '60%',
    };

    const createChartData = (score: string) => {
        const numericScore = parseInt(score.replace('%', ''));
        const colors = getColors(numericScore);

        return {
            datasets: [{
                data: [
                    numericScore,
                    100 - numericScore,
                ],
                backgroundColor: colors.backgroundColor,
                borderColor: colors.borderColor,
                borderWidth: 1,
            }],
        };
    };

    const ScoreChart = ({ score, title }: { score: string, title: string }) => (
        <div className="flex flex-col gap-2 items-center">
            <div className="h-[150px] w-full">
                <Doughnut
                    data={createChartData(score)}
                    options={options}
                    plugins={[centerTextPlugin]}
                />
            </div>
            <h2 className="text-md font-semibold">{title}</h2> {/* Increased text size */}
        </div>
    );

    const handleCopy = (data: string[], text: string) => {
        if (data && text === "suggestedImprovements") {
            navigator.clipboard.writeText(data.join('\n'));
        }
        toast("Copied to clipboard")
    }

    return (
        <div className="flex flex-col gap-4 items-center w-full">
            <div className="flex flex-wrap gap-4 justify-evenly items-center w-full border-b pb-4 border-gray-300">
                <ScoreChart
                    score={formattedText.combinedScore.keywordMatchScore}
                    title="Keyword Match Score"
                />
                <ScoreChart
                    score={formattedText.combinedScore.skillsetMatchScore}
                    title="Skillset Match Score"
                />
            </div>
            <div className="flex flex-col gap-4 items-center">
                <div className="h-[280px] w-full">
                    <Doughnut
                        data={createChartData(formattedText.combinedScore.overallScore)}
                        options={options}
                        plugins={[largerCenterTextPlugin]}
                    />
                </div>
                <h2 className="text-xl font-semibold">Overall ATS Score</h2>
            </div>
            {/* Tips */}
            <div className="border border-gray-300 rounded-md shadow-sm p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <h2 className="flex items-center gap-2 text-[16px] font-semibold"><HandHelping className="w-5 h-5" />Tips</h2>
                    <Clipboard
                        className="w-4 h-4 transition-colors text-gray-600 hover:text-gray-800 cursor-pointer"
                        onClick={() => handleCopy(formattedText.combinedScore.suggestedImprovements, "suggestedImprovements")}
                    />
                </div>
                <ul className="list-decimal list-inside text-sm space-y-2 ml-[0.5em]">
                    {formattedText.combinedScore.suggestedImprovements.map((tips, index) => (
                        <li key={index}>{tips}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}