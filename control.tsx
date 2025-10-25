import React from 'react';
import { Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';

interface ControlsProps {
    treeInput: string;
    setTreeInput: (value: string) => void;
    onVisualize: () => void;
    onReset: () => void;
    onStep: (direction: 'next' | 'prev') => void;
    isVisualizing: boolean;
    currentStep: number;
    totalSteps: number;
}

const Controls: React.FC<ControlsProps> = ({
    treeInput,
    setTreeInput,
    onVisualize,
    onReset,
    onStep,
    isVisualizing,
    currentStep,
    totalSteps,
}) => {
    return (
        <div className="bg-gray-800 rounded-lg shadow-2xl p-4 border border-gray-700 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-300">Controls</h2>
            
            <div>
                <label htmlFor="tree-input" className="block text-sm font-medium text-gray-400 mb-1">
                    Tree Structure (S-expression)
                </label>
                <textarea
                    id="tree-input"
                    value={treeInput}
                    onChange={(e) => setTreeInput(e.target.value)}
                    disabled={isVisualizing}
                    rows={4}
                    className="w-full bg-gray-900/50 border border-gray-600 rounded-md p-2 text-gray-200 font-mono text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition disabled:opacity-50"
                    placeholder="(root (child1 val1 val2) (child2 val3))"
                />
            </div>
            
            {!isVisualizing ? (
                <button
                    onClick={onVisualize}
                    className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-105"
                >
                    <Play size={18} />
                    Visualize
                </button>
            ) : (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                        <button
                            onClick={() => onStep('prev')}
                            disabled={currentStep === 0}
                            className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <SkipBack size={18} /> Prev
                        </button>
                        <button
                            onClick={() => onStep('next')}
                            disabled={currentStep >= totalSteps - 1}
                            className="flex-1 flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next <SkipForward size={18} />
                        </button>
                    </div>

                     <div className="text-center text-sm text-gray-400">
                        Step {currentStep + 1} of {totalSteps}
                    </div>

                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div 
                            className="bg-cyan-500 h-2.5 rounded-full transition-all duration-300" 
                            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}>
                        </div>
                    </div>

                    <button
                        onClick={onReset}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md transition"
                    >
                        <RotateCcw size={18}/>
                        Reset
                    </button>
                </div>
            )}
        </div>
    );
};

export default Controls;
