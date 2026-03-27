import React from 'react';
import { TOOLKITS } from '../constants';
import type { Toolkit } from '../types';

const ToolkitCard: React.FC<{ toolkit: Toolkit }> = ({ toolkit }) => (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 transition-shadow hover:shadow-md flex flex-col">
        <h3 className="font-bold text-sky-700">{toolkit.name}</h3>
        <p className="text-sm text-slate-600 mt-1 flex-grow">{toolkit.description}</p>
        <div className="mt-3 pt-3 border-t border-slate-200">
             <p className="text-xs text-slate-600"><span className="font-semibold">Measures:</span> {toolkit.measures}</p>
             <p className="text-xs text-slate-400 mt-1 italic">Source: {toolkit.source}</p>
        </div>
    </div>
);


interface ToolkitIntroProps {
    onContinue: () => void;
    onBack: () => void;
}

const ToolkitIntro: React.FC<ToolkitIntroProps> = ({ onContinue, onBack }) => {
  return (
    <div>
        <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Next: In-Depth Analysis</h2>
            <p className="text-slate-600 mb-8 max-w-3xl mx-auto">
                Your answers have been saved. We will now ask you 20 tailored questions to gather more details for analysis. Your business model will be assessed using these seven industry-standard toolkits:
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left mb-8">
            {TOOLKITS.map(toolkit => <ToolkitCard key={toolkit.name} toolkit={toolkit} />)}
             <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 transition-shadow hover:shadow-md md:col-span-2 lg:col-span-1 flex flex-col">
                 <h3 className="font-bold text-sky-700">Comprehensive Report</h3>
                 <p className="text-sm text-slate-600 mt-1 flex-grow">The final output will be a detailed report integrating findings from all toolkits, plus industry use cases, macroeconomic factors, risks, opportunities, and actionable recommendations.</p>
            </div>
        </div>
        
        <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={onBack}
              className="bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-lg hover:bg-slate-300 transition-colors duration-300 text-sm"
            >
              Back
            </button>
            <button
                onClick={onContinue}
                className="bg-sky-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-sky-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 shadow-md"
            >
                Start Detailed Q&A
            </button>
        </div>
    </div>
  );
};

export default ToolkitIntro;