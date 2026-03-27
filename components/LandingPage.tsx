import React from 'react';

interface LandingPageProps {
  onStart: (isFaithBased: boolean) => void;
  onStartDemo: (isFaithBased: boolean) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onStartDemo }) => {
    return (
        <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-3">
                Welcome to Your Business Advisor
                <span className="bg-orange-200 text-orange-800 text-xs font-bold px-2.5 py-1 rounded-full">BETA</span>
            </h2>
            <p className="text-slate-600 mb-8 max-w-2xl">
                This tool empowers SMEs with expert advisory and tailored training. We analyze your business model using the **8 Ps for critical success factors** and assess it against **7 toolkits for critical features**. Our goal is to foster innovation, growth, and sustainable value, helping you align operations and finance for success in dynamic markets.
            </p>
            
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Guided Self Assessment Card */}
                <div className="flex flex-col p-6 bg-slate-50 border-2 border-slate-200 rounded-lg shadow-sm">
                    <div className="flex-grow">
                        <span className="text-4xl mb-2">🚀</span>
                        <h3 className="text-lg font-bold text-slate-800">Guided Self Assessment</h3>
                        <p className="text-sm text-slate-600 mt-2">Answer a series of questions to build a comprehensive report tailored to your unique business model.</p>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-300">
                       <p className="text-sm font-semibold text-slate-700 mb-3">Start by choosing your perspective:</p>
                       <div className="flex flex-col gap-3">
                            <button
                                onClick={() => onStart(false)}
                                className="w-full text-left p-3 bg-white border border-slate-300 rounded-md hover:bg-sky-50 hover:border-sky-400 transition-colors duration-200"
                            >
                                <span className="font-bold text-slate-800">💡 Non-Faith</span>
                                <p className="text-xs text-slate-500 mt-1">Standard business analysis and recommendations.</p>
                            </button>
                            <button
                                onClick={() => onStart(true)}
                                className="w-full text-left p-3 bg-white border border-slate-300 rounded-md hover:bg-indigo-50 hover:border-indigo-400 transition-colors duration-200"
                            >
                                <span className="font-bold text-slate-800">🕊️ Faith-Based</span>
                                <p className="text-xs text-slate-500 mt-1">Integrates spiritual principles for a holistic approach.</p>
                            </button>
                       </div>
                    </div>
                </div>

                {/* Quick Assessment Card */}
                <a href="http://www.businessmodeladvisory.org" target="_blank" rel="noopener noreferrer" className="flex flex-col p-6 bg-slate-50 border-2 border-slate-200 rounded-lg shadow-sm hover:border-sky-400 transition-colors duration-200">
                    <div className="flex-grow">
                        <span className="text-4xl mb-2">⚡</span>
                        <h3 className="text-lg font-bold text-slate-800">Quick Assessment</h3>
                        <p className="text-sm text-slate-600 mt-2">Take a brief, high-level assessment to quickly identify key areas for improvement in your business model.</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-300 flex items-end">
                        <p className="w-full text-center p-3 bg-sky-600 text-white font-bold rounded-md hover:bg-sky-700 transition-colors duration-200">
                            Go to Site
                        </p>
                    </div>
                </a>

                {/* Demo Card */}
                <div className="flex flex-col p-6 bg-slate-50 border-2 border-slate-200 rounded-lg shadow-sm">
                    <div className="flex-grow">
                        <span className="text-4xl mb-2">📄</span>
                        <h3 className="text-lg font-bold text-slate-800">View a Demo Report</h3>
                        <p className="text-sm text-slate-600 mt-2">Instantly generate a sample report for a hypothetical bakery. <strong>Note:</strong> This demo skips the interactive Q&A step for speed.</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-300">
                        <p className="text-sm font-semibold text-slate-700 mb-3">Choose a demo perspective:</p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => onStartDemo(false)}
                                className="w-full text-left p-3 bg-white border border-slate-300 rounded-md hover:bg-sky-50 hover:border-sky-400 transition-colors duration-200"
                            >
                                <span className="font-bold text-slate-800">💡 Non-Faith Demo</span>
                                <p className="text-xs text-slate-500 mt-1">Generates a standard business report.</p>
                            </button>
                            <button
                                onClick={() => onStartDemo(true)}
                                className="w-full text-left p-3 bg-white border border-slate-300 rounded-md hover:bg-indigo-50 hover:border-indigo-400 transition-colors duration-200"
                            >
                                <span className="font-bold text-slate-800">🕊️ Faith-Based Demo</span>
                                <p className="text-xs text-slate-500 mt-1">Generates a report with integrated spiritual guidance.</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;