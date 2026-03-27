import React, { useState, useEffect } from 'react';
import type { InteractiveScenario, StatementData, ScenarioOption } from '../types';
import { evaluateUserResponse } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface TrainingScenariosProps {
    scenarios: InteractiveScenario[];
    statementData: StatementData;
    onBack: () => void;
}

const TrainingScenarios: React.FC<TrainingScenariosProps> = ({ scenarios, statementData, onBack }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<ScenarioOption | null>(null);
    const [customResponse, setCustomResponse] = useState('');
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const currentScenario = scenarios[currentIndex];

    useEffect(() => {
        // Reset state when the scenario changes
        setSelectedOption(null);
        setCustomResponse('');
        setFeedback(null);
    }, [currentIndex]);

    const handleOptionSelect = (option: ScenarioOption) => {
        setCustomResponse(''); // Clear custom response if an option is selected
        setSelectedOption(option);
        setFeedback(option.analysis); // Immediately show the pre-canned analysis
    };

    const handleCustomResponseSubmit = async () => {
        if (!customResponse.trim()) return;
        setIsLoading(true);
        setSelectedOption(null); // Clear selected option
        setFeedback(null);
        try {
            const result = await evaluateUserResponse(currentScenario.scenario, customResponse, statementData);
            setFeedback(result);
        } catch (error) {
            console.error("Failed to get feedback:", error);
            setFeedback("Sorry, there was an error getting feedback for your response. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleNext = () => {
        if (currentIndex < scenarios.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold text-slate-800">Interactive Training Scenarios</h2>
                 <span className="text-sm font-semibold bg-slate-200 text-slate-700 py-1 px-3 rounded-full">
                    Scenario {currentIndex + 1} of {scenarios.length}
                </span>
            </div>
            <p className="text-slate-600 mb-6">Test your strategic thinking. Choose a response or write your own to receive instant feedback.</p>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-lg text-slate-800 mb-2">The Situation:</h3>
                <p className="text-slate-700">{currentScenario.scenario}</p>
            </div>
            
            <div>
                <h3 className="font-semibold text-slate-800 mb-3">How would you respond?</h3>
                <div className="space-y-3 mb-4">
                    {currentScenario.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleOptionSelect(option)}
                            className={`w-full text-left p-3 border rounded-md transition-all duration-200 ${selectedOption?.text === option.text ? 'bg-sky-100 border-sky-500 ring-2 ring-sky-300' : 'bg-white border-slate-300 hover:bg-slate-50'}`}
                        >
                            {option.text}
                        </button>
                    ))}
                </div>
                
                <div className="flex items-start gap-4">
                    <textarea
                        rows={3}
                        value={customResponse}
                        onChange={(e) => setCustomResponse(e.target.value)}
                        placeholder="Or, type your own response here..."
                        className="flex-grow w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                    />
                    <button
                        onClick={handleCustomResponseSubmit}
                        disabled={!customResponse.trim() || isLoading}
                        className="bg-slate-600 text-white font-semibold py-3 px-5 rounded-lg hover:bg-slate-700 transition-colors duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                        Get Feedback
                    </button>
                </div>
            </div>
            
            {isLoading && <div className="mt-6"><LoadingSpinner message="Analyzing your response..." /></div>}
            
            {feedback && !isLoading && (
                <div className="mt-6 bg-green-50 border-l-4 border-green-500 text-green-800 p-4 rounded-r-lg">
                    <h4 className="font-bold text-lg mb-2">Analysis & Feedback:</h4>
                    <p className="text-sm whitespace-pre-wrap">{feedback}</p>
                </div>
            )}
            
            <div className="flex justify-between items-center pt-8 mt-6 border-t border-slate-200">
                <button
                    type="button"
                    onClick={onBack}
                    className="bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-lg hover:bg-slate-300 transition-colors duration-300 text-sm"
                >
                    Back to Report
                </button>
                <div className="flex items-center gap-4">
                     <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="font-semibold py-3 px-6 rounded-lg transition-colors duration-300 text-sm disabled:text-slate-400 disabled:cursor-not-allowed text-slate-700 hover:bg-slate-100"
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={currentIndex === scenarios.length - 1}
                        className="bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                        Next Scenario
                    </button>
                </div>
            </div>

        </div>
    );
};

export default TrainingScenarios;
