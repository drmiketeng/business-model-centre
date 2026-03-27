import React, { useState, useEffect, useCallback } from 'react';
import type { Question } from '../types';

interface QuestionnaireProps {
  questions: Question[];
  answers: string[];
  setAnswers: React.Dispatch<React.SetStateAction<string[]>>;
  onSubmit: (answers: string[]) => void;
  onBack: () => void;
  isDemo?: boolean;
}

// A single question with its options and custom input field
const QuestionItem: React.FC<{
    question: Question;
    index: number;
    onAnswerChange: (index: number, answer: string) => void;
}> = ({ question, index, onAnswerChange }) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [customAnswer, setCustomAnswer] = useState('');

    const handleOptionChange = (option: string, isChecked: boolean) => {
        setSelectedOptions(prev => 
            isChecked ? [...prev, option] : prev.filter(item => item !== option)
        );
    };

    // useCallback to prevent re-creating the function on every render
    const updateCombinedAnswer = useCallback(() => {
        const combined = [
            ...selectedOptions,
            customAnswer.trim() ? `Other details: ${customAnswer.trim()}` : ''
        ].filter(Boolean).join('\n- ');
        
        // Prepend with a dash if there's content
        const finalAnswer = combined ? `- ${combined}` : '';
        onAnswerChange(index, finalAnswer);
    }, [selectedOptions, customAnswer, index, onAnswerChange]);


    useEffect(() => {
        updateCombinedAnswer();
    }, [selectedOptions, customAnswer, updateCombinedAnswer]);

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <label className="block text-md font-semibold text-slate-800 mb-3">
              {`${index + 1}. ${question.text}`}
            </label>
            
            <div className="space-y-2 mb-3">
                {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id={`q-${index}-opt-${optIndex}`}
                                type="checkbox"
                                onChange={(e) => handleOptionChange(option, e.target.checked)}
                                className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-slate-300 rounded"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor={`q-${index}-opt-${optIndex}`} className="text-slate-700 cursor-pointer">
                                {option}
                            </label>
                        </div>
                    </div>
                ))}
            </div>

            <textarea
              id={`question-${index}-custom`}
              rows={3}
              value={customAnswer}
              onChange={(e) => setCustomAnswer(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              placeholder="Add your own information or expand on your selections here..."
            />
        </div>
    );
}


const Questionnaire: React.FC<QuestionnaireProps> = ({ questions, answers, setAnswers, onSubmit, onBack, isDemo = false }) => {
  
  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers);
  };

  if (isDemo) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Demo Questionnaire</h2>
        <p className="text-slate-600 mb-6">This is a demonstration. Below are the questions generated for our hypothetical bakery, along with sample answers to show what kind of input leads to a good report. Review the answers and continue to see the final generated report.</p>
        
        <div className="space-y-6">
          {questions.map((q, index) => (
            <div key={index} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="block text-md font-semibold text-slate-800 mb-3">
                {`${index + 1}. ${q.text}`}
              </p>
              <div className="bg-white p-3 rounded-md border border-slate-200">
                <p className="text-sm font-semibold text-sky-800 mb-2">Sample Answer:</p>
                <pre className="whitespace-pre-wrap font-sans text-sm text-slate-600">{answers[index] || 'No answer provided.'}</pre>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-8 mt-4">
          <button
              type="button"
              onClick={onBack}
              className="bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-lg hover:bg-slate-300 transition-colors duration-300 text-sm"
          >
              Back
          </button>
          <button
            onClick={() => onSubmit(answers)}
            className="bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 shadow-md flex items-center gap-2"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
            Continue to Report
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Detailed Questionnaire</h2>
      <p className="text-slate-600 mb-6">Select the options that apply to your business and add any other relevant details. Your responses will be used to generate your comprehensive business analysis.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, index) => (
          <QuestionItem
            key={index}
            question={q}
            index={index}
            onAnswerChange={handleAnswerChange}
          />
        ))}

        <div className="flex justify-between items-center pt-4">
          <button
              type="button"
              onClick={onBack}
              className="bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-lg hover:bg-slate-300 transition-colors duration-300 text-sm"
          >
              Back
          </button>
          <button
            type="submit"
            className="bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 shadow-md flex items-center gap-2"
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
            Submit & Generate Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default Questionnaire;