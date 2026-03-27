import React from 'react';
import type { AppStep } from '../types';

interface StepIndicatorProps {
  currentStep: AppStep;
}

const steps: { id: AppStep; title: string }[] = [
  { id: 'statement', title: '1. Model Statement' },
  { id: 'toolkit_intro', title: '2. Toolkits' },
  { id: 'questionnaire', title: '3. Q&A' },
  { id: 'report', title: '4. Report' },
  { id: 'training_scenarios', title: '5. Training' },
];

const Step: React.FC<{ title: string; isActive: boolean; isCompleted: boolean }> = ({ title, isActive, isCompleted }) => {
    const baseClasses = "w-full py-2 px-1 text-center text-sm font-medium transition-colors duration-300";
    const activeClasses = "bg-sky-600 text-white";
    const completedClasses = "bg-green-600 text-white";
    const inactiveClasses = "bg-slate-200 text-slate-500";
    
    let stateClasses = inactiveClasses;
    if (isActive) {
        stateClasses = activeClasses;
    } else if (isCompleted) {
        stateClasses = completedClasses;
    }

  return <div className={`${baseClasses} ${stateClasses}`}>{title}</div>;
};

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const currentStepIndex = steps.findIndex(step => {
    if (step.id === 'toolkit_intro' && currentStep === 'statement') return false;
    if (step.id === 'questionnaire' && ['statement', 'toolkit_intro'].includes(currentStep)) return false;
    if (step.id === 'report' && !['report', 'feedback'].includes(currentStep)) return false;
    if (step.id === 'training_scenarios' && currentStep !== 'training_scenarios') return false;
    
    return currentStep === step.id || (step.id === 'report' && ['feedback'].includes(currentStep));
  });


  return (
    <div className="flex rounded-lg overflow-hidden border border-slate-300 shadow-sm mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex-1 first:rounded-l-md last:rounded-r-md">
           <Step
                title={step.title}
                isActive={index === currentStepIndex}
                isCompleted={index < currentStepIndex}
           />
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
