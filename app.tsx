import React, { useState, useCallback, useMemo } from 'react';
import TreeVisualizer from './components/TreeVisualizer';
import Controls from './components/Controls';
import ExplanationPanel from './components/ExplanationPanel';
import { parseAndRunMinimax } from './services/minimaxService';
import { getExplanation } from './services/geminiService';
import type { TreeNode, VisualizationStep } from './types';
import { Info, Github } from 'lucide-react';

const DEFAULT_TREE = '(A (B (D 3 17) (E 2 12)) (C (F 15) (G (H 0 2) (I 4 6))))';

const App: React.FC = () => {
    const [treeInput, setTreeInput] = useState<string>(DEFAULT_TREE);
    const [treeData, setTreeData] = useState<TreeNode | null>(null);
    const [visualizationSteps, setVisualizationSteps] = useState<VisualizationStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [isVisualizing, setIsVisualizing] = useState<boolean>(false);
    const [aiExplanation, setAiExplanation] = useState<string>('');
    const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

    const handleVisualize = useCallback(() => {
        setError(null);
        setAiExplanation('');
        try {
            const { tree, steps } = parseAndRunMinimax(treeInput);
            setTreeData(tree);
            setVisualizationSteps(steps);
            setCurrentStepIndex(0);
            setIsVisualizing(true);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('An unknown error occurred during parsing or visualization.');
            }
            setIsVisualizing(false);
            setTreeData(null);
            setVisualizationSteps([]);
        }
    }, [treeInput]);

    const handleReset = useCallback(() => {
        setIsVisualizing(false);
        setTreeData(null);
        setVisualizationSteps([]);
        setCurrentStepIndex(0);
        setError(null);
        setAiExplanation('');
    }, []);

    const handleStep = useCallback((direction: 'next' | 'prev') => {
        setCurrentStepIndex(prev => {
            const newIndex = direction === 'next' ? prev + 1 : prev - 1;
            if (newIndex >= 0 && newIndex < visualizationSteps.length) {
                return newIndex;
            }
            return prev;
        });
    }, [visualizationSteps.length]);

    const handleExplain = useCallback(async () => {
        if (!treeData || !visualizationSteps[currentStepIndex]) return;
        setIsAiLoading(true);
        setAiExplanation('');
        try {
            const currentStep = visualizationSteps[currentStepIndex];
            const explanation = await getExplanation(treeInput, currentStep);
            setAiExplanation(explanation);
        } catch (e) {
            if (e instanceof Error) {
                setAiExplanation(`Error fetching explanation: ${e.message}`);
            } else {
                setAiExplanation('An unknown error occurred while fetching the explanation.');
            }
        } finally {
            setIsAiLoading(false);
        }
    }, [treeData, treeInput, currentStepIndex, visualizationSteps]);

    const currentStep = useMemo(() => {
        return visualizationSteps[currentStepIndex] || null;
    }, [visualizationSteps, currentStepIndex]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col font-sans">
            <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 shadow-lg flex justify-between items-center">
                <h1 className="text-2xl font-bold text-cyan-400 tracking-wider">Minimax Algorithm Visualizer</h1>
                 <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    <Github size={24} />
                </a>
            </header>

            <main className="flex flex-1 flex-col lg:flex-row p-4 gap-4">
                <div className="flex-1 flex flex-col bg-gray-800 rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-300">Tree Visualization</h2>
                    </div>
                    {error && (
                        <div className="m-4 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
                            <strong>Error:</strong> {error}
                        </div>
                    )}
                    {!isVisualizing && (
                         <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                            <Info size={48} className="text-cyan-500 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Welcome!</h3>
                            <p className="text-gray-400 max-w-md">
                                Enter a tree structure in S-expression format below (e.g., `(A (B 3 5) (C 6))`) and click 'Visualize' to begin.
                            </p>
                        </div>
                    )}
                    <div className="flex-1 relative">
                        {isVisualizing && treeData && currentStep && (
                           <TreeVisualizer tree={treeData} currentStep={currentStep} />
                        )}
                    </div>
                </div>

                <aside className="w-full lg:w-96 flex flex-col gap-4">
                    <Controls
                        treeInput={treeInput}
                        setTreeInput={setTreeInput}
                        onVisualize={handleVisualize}
                        onReset={handleReset}
                        onStep={handleStep}
                        isVisualizing={isVisualizing}
                        currentStep={currentStepIndex}
                        totalSteps={visualizationSteps.length}
                    />
                    <ExplanationPanel
                        currentStep={currentStep}
                        aiExplanation={aiExplanation}
                        onExplain={handleExplain}
                        isAiLoading={isAiLoading}
                        isVisualizing={isVisualizing}
                    />
                </aside>
            </main>
        </div>
    );
};

export default App;
