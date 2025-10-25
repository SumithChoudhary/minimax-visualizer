import React from 'react';
import type { VisualizationStep } from '../types';
import { Sparkles } from 'lucide-react';

interface ExplanationPanelProps {
    currentStep: VisualizationStep | null;
    aiExplanation: string;
    onExplain: () => void;
    isAiLoading: boolean;
    isVisualizing: boolean;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-t-transparent border-cyan-400 rounded-full animate-spin"></div>
        <span>Thinking...</span>
    </div>
);


const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ currentStep, aiExplanation, onExplain, isAiLoading, isVisualizing }) => {
    return (
        <div className="bg-gray-800 rounded-lg shadow-2xl p-4 border border-gray-700 flex flex-col flex-1">
            <h2 className="text-lg font-semibold text-gray-300 mb-2">Explanation</h2>
            
            {isVisualizing && currentStep ? (
                <div className="flex flex-col gap-4 h-full">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Current Action</h3>
                        <p className="mt-1 p-3 bg-gray-900/50 rounded-md text-cyan-300 border border-gray-700 text-sm">
                            {currentStep.message}
                        </p>
                    </div>

                    <div className="flex-1 flex flex-col">
                         <div className="flex justify-between items-center mb-1">
                             <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">AI Insight</h3>
                             <button
                                onClick={onExplain}
                                disabled={isAiLoading}
                                className="flex items-center gap-1.5 text-xs bg-indigo-600/50 hover:bg-indigo-600 text-indigo-200 font-semibold py-1 px-2.5 rounded-md transition disabled:opacity-50 disabled:cursor-wait"
                            >
                                <Sparkles size={14}/>
                                Explain Step
                            </button>
                         </div>
                         <div className="flex-1 p-3 bg-gray-900/50 rounded-md border border-gray-700 text-sm text-gray-300 overflow-y-auto prose prose-sm prose-invert max-w-none prose-p:my-2 prose-strong:text-gray-100 prose-code:text-cyan-300 prose-code:bg-gray-700/50 prose-code:p-1 prose-code:rounded">
                            {isAiLoading && <LoadingSpinner />}
                            {!isAiLoading && aiExplanation && <div dangerouslySetInnerHTML={{ __html: aiExplanation.replace(/\n/g, '<br />') }} />}
                            {!isAiLoading && !aiExplanation && <p className="text-gray-500">Click "Explain Step" to get a detailed explanation from Gemini.</p>}
                         </div>
                    </div>
                </div>
            ) : (
                 <div className="flex items-center justify-center h-full text-gray-500 text-center">
                    <p>Start the visualization to see step-by-step explanations.</p>
                </div>
            )}
        </div>
    );
};

export default ExplanationPanel;
