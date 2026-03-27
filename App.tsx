import React, { useState, useCallback } from 'react';
import type { AppStep, StatementData, Question, PrayerData, InteractiveScenario } from './types';
import { generateQuestionsWithOptions, generateReport, generatePrayer, generateTrainingScenarios, generateDemoAnswers } from './services/geminiService';
import { hypotheticalData } from './constants';

import Disclaimer from './components/Disclaimer';
import LandingPage from './components/LandingPage';
import StatementBuilder from './components/StatementBuilder';
import ToolkitIntro from './components/ToolkitIntro';
import Questionnaire from './components/Questionnaire';
import ReportDisplay from './components/ReportDisplay';
import TrainingScenarios from './components/TrainingScenarios';
import LoadingSpinner from './components/LoadingSpinner';
import FeedbackForm from './components/FeedbackForm';
import StepIndicator from './components/StepIndicator';
import Assistant from './components/Assistant';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('disclaimer');
  const [email, setEmail] = useState<string>('');
  const [isFaithBased, setIsFaithBased] = useState<boolean>(false);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [statementData, setStatementData] = useState<StatementData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [report, setReport] = useState<string>('');
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [trainingScenarios, setTrainingScenarios] = useState<InteractiveScenario[]>([]);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleDisclaimerAccept = (userEmail: string) => {
    setEmail(userEmail);
    setStep('landing');
  };

  const handleStart = (faithBased: boolean) => {
    setIsFaithBased(faithBased);
    setStep('statement');
  };
  
  const handleStartDemo = (isFaithBased: boolean) => {
    setIsFaithBased(isFaithBased);
    setStatementData(hypotheticalData);
    setIsDemo(true);
    setError(null);
    setStep('statement');
  };

  const handleStatementSubmit = async (data: StatementData) => {
    setStatementData(data);
    setStep('generating_questions');
    setLoadingMessage('Generating tailored questions and answer options based on your business model...');
    setError(null);
    try {
      const generatedQuestions = await generateQuestionsWithOptions(data);
      setQuestions(generatedQuestions);

      if (isDemo) {
        setLoadingMessage('Generating sample answers for the demo...');
        const demoAnswers = await generateDemoAnswers(data, generatedQuestions);
        setAnswers(demoAnswers);
      } else {
        setAnswers(new Array(generatedQuestions.length).fill(''));
      }
      
      setStep('toolkit_intro');
    } catch (e) {
      setError('Failed to generate questions. Please try again.');
      console.error(e);
      setStep('statement');
    } finally {
      setLoadingMessage('');
    }
  };
  
  const handleStartQuestionnaire = () => {
    setStep('questionnaire');
  };

  const handleQuestionnaireSubmit = async (submittedAnswers: string[]) => {
    setAnswers(submittedAnswers);
    setStep('generating_report');
    setLoadingMessage('Analyzing your business and generating a comprehensive report. This may take a few moments...');
    setError(null);
    setReport('');
    setPrayerData(null);
    setTrainingScenarios([]);

    if (!statementData) {
      setError('Business statement data is missing.');
      setStep('statement');
      return;
    }

    const answeredQuestions: { text: string; answer?: string }[] = questions.map((q, i) => ({
      text: q.text,
      answer: submittedAnswers[i],
    }));

    try {
      const generatedReport = await generateReport(statementData, answeredQuestions, isFaithBased, isDemo);
      setReport(generatedReport);
      
      if (isFaithBased) {
        setLoadingMessage('Generating your personalized Guidance Prayer...');
        const generatedPrayer = await generatePrayer(statementData, answeredQuestions, generatedReport);
        setPrayerData(generatedPrayer);
      }
      
      setLoadingMessage('Generating interactive training scenarios...');
      const scenarios = await generateTrainingScenarios(statementData);
      setTrainingScenarios(scenarios);

      setStep('report');
    } catch (e) {
      setError('Failed to generate the report. Please check your inputs and try again.');
      console.error(e);
      setStep('questionnaire');
    } finally {
      setLoadingMessage('');
    }
  };

  const handleEdit = () => {
    setReport('');
    setPrayerData(null);
    setTrainingScenarios([]);
    setIsDemo(false); // Exit demo mode if editing
    setStep('statement');
  };
  
  const handleStartTraining = () => {
    if (trainingScenarios.length > 0) {
      setStep('training_scenarios');
    } else {
      setError("Training scenarios are not available. Please generate a report first.");
    }
  };

  const handleFeedback = () => {
    setStep('feedback');
  }

  const handleFeedbackSubmit = () => {
    // In a real app, this would submit to a backend.
    setStep('landing'); 
  }
  
  const handleReset = () => {
    setStep('disclaimer');
    setEmail('');
    setIsFaithBased(false);
    setIsDemo(false);
    setStatementData(null);
    setQuestions([]);
    setAnswers([]);
    setReport('');
    setPrayerData(null);
    setTrainingScenarios([]);
    setLoadingMessage('');
    setError(null);
  };
  
  const handleGoHome = () => {
    // Clear progress, but keep email/disclaimer state
    setIsFaithBased(false);
    setIsDemo(false);
    setStatementData(null);
    setQuestions([]);
    setAnswers([]);
    setReport('');
    setPrayerData(null);
    setTrainingScenarios([]);
    setLoadingMessage('');
    setError(null);
    setStep('landing');
  };
  
  const handleBack = () => {
    setError(null);
    switch (step) {
      case 'statement':
        setIsDemo(false); // Exit demo if going back from statement
        setStep('landing');
        break;
      case 'toolkit_intro':
        setStep('statement');
        break;
      case 'questionnaire':
        setStep('toolkit_intro');
        break;
      case 'report':
        setStep('questionnaire');
        break;
      case 'training_scenarios':
        setStep('report');
        break;
      case 'feedback':
        setStep('report');
        break;
    }
  };

  const renderContent = () => {
    if (loadingMessage) {
      return <LoadingSpinner message={loadingMessage} />;
    }

    switch (step) {
      case 'disclaimer':
        return <Disclaimer onAccept={handleDisclaimerAccept} />;
      case 'landing':
        return <LandingPage onStart={handleStart} onStartDemo={handleStartDemo} />;
      case 'statement':
        return <StatementBuilder onSubmit={handleStatementSubmit} initialData={statementData} onBack={handleBack} />;
      case 'toolkit_intro':
        return <ToolkitIntro onContinue={handleStartQuestionnaire} onBack={handleBack} />;
      case 'questionnaire':
        return <Questionnaire questions={questions} answers={answers} setAnswers={setAnswers} onSubmit={handleQuestionnaireSubmit} onBack={handleBack} isDemo={isDemo}/>;
      case 'report':
        return <ReportDisplay report={report} prayerData={prayerData} onEdit={handleEdit} onFeedback={handleFeedback} onReset={handleReset} onStartTraining={handleStartTraining}/>;
       case 'training_scenarios':
        return <TrainingScenarios scenarios={trainingScenarios} statementData={statementData!} onBack={handleBack} />;
      case 'feedback':
        return <FeedbackForm onSubmit={handleFeedbackSubmit} />;
      case 'generating_questions':
      case 'generating_report':
        return <LoadingSpinner message={loadingMessage} />;
      default:
        return <div>Invalid step</div>;
    }
  };
  
  const showStepIndicator = !['disclaimer', 'landing', 'generating_questions', 'generating_report'].includes(step);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans flex flex-col">
      <div className="flex-grow flex flex-col items-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl mx-auto">
          <header className="text-center mb-8 relative">
            {step !== 'disclaimer' && step !== 'landing' && (
                <button onClick={handleGoHome} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-slate-300 text-slate-600 font-semibold py-2 px-4 rounded-lg hover:bg-slate-100 transition-colors duration-300 text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  Home
                </button>
              )}
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                {step === 'disclaimer' ? 'Welcome to Business Model Centre' : 'SME Business Model Advisor'}
              </h1>
              <p className="text-slate-600 mt-2">AI-Powered Strategic Analysis for Your Business</p>
          </header>

          {isFaithBased && step !== 'disclaimer' && step !== 'landing' && (
            <div className="bg-sky-100 border-l-4 border-sky-500 text-sky-800 p-4 rounded-md mb-8 text-center shadow-sm">
                <h2 className="font-bold text-lg">Spiritual Perspectives. Secular Impacts.</h2>
                <p className="italic mt-1">"A man's heart plans his way, but the Lord directs his steps." - Proverbs 16:9</p>
            </div>
          )}

          {showStepIndicator && <StepIndicator currentStep={step} />}

          <main className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200">
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>}
            {renderContent()}
          </main>
        </div>
      </div>
      
      {step !== 'disclaimer' && <Assistant />}
      
      <footer className="w-full text-center py-4 px-4 bg-slate-50">
        <p className="text-xs text-slate-500">&copy; 2005 Corporate Turnaround Centre. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;