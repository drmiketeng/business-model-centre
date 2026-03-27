import React, { useState } from 'react';
import type { StatementData } from '../types';
import { emptyData } from '../constants';

interface StatementBuilderProps {
  onSubmit: (data: StatementData) => void;
  onBack: () => void;
  initialData?: StatementData | null;
}

const InputField: React.FC<{id: keyof StatementData, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void, placeholder: string, isTextArea?: boolean}> = ({ id, label, value, onChange, placeholder, isTextArea=false }) => {
    const Component = isTextArea ? 'textarea' : 'input';
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <Component
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={isTextArea ? 3 : undefined}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                required
            />
        </div>
    );
};

const StatementBuilder: React.FC<StatementBuilderProps> = ({ onSubmit, onBack, initialData }) => {
  const [formData, setFormData] = useState<StatementData>(initialData || emptyData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const generatedStatement = `We help ${formData.customer || '[Target Customer]'} who ${formData.problem || '[have a problem/need]'} by ${formData.solution || '[providing a solution]'} so they can ${formData.benefit || '[achieve a benefit]'}. We make money by ${formData.revenueModel || '[our revenue model]'}. Our biggest challenge is ${formData.challenge || '[our biggest challenge]'}.`;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Craft Your Business Model Statement</h2>
      <p className="text-slate-600 mb-6">Answer the following questions to build a clear, concise statement. We've included examples to guide you.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField id="industry" label="Your Industry" value={formData.industry} onChange={handleChange} placeholder="e.g., Food & Beverage, SaaS, Retail" />
            <InputField id="country" label="Your Country of Operation" value={formData.country} onChange={handleChange} placeholder="e.g., United States, Singapore" />
        </div>
        <hr/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField id="customer" label="Who is your target customer?" value={formData.customer} onChange={handleChange} placeholder="e.g., busy urban professionals" />
            <InputField id="problem" label="What problem or need do they have?" value={formData.problem} onChange={handleChange} placeholder="e.g., lack time to cook healthy meals" />
            <InputField id="solution" label="How do you solve it?" value={formData.solution} onChange={handleChange} placeholder="e.g., delivering pre-portioned meal kits" isTextArea />
            <InputField id="benefit" label="What is the main benefit for them?" value={formData.benefit} onChange={handleChange} placeholder="e.g., enjoy a home-cooked meal in 15 mins" />
            <InputField id="revenueModel" label="How do you make money?" value={formData.revenueModel} onChange={handleChange} placeholder="e.g., a weekly subscription model" />
            <InputField id="challenge" label="What's your biggest challenge?" value={formData.challenge} onChange={handleChange} placeholder="e.g., logistics and fresh ingredient sourcing" />
        </div>

        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg mt-6">
          <h3 className="font-semibold text-slate-700 mb-2">Your Generated Statement:</h3>
          <p className="text-slate-600 italic">{generatedStatement}</p>
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
            type="submit"
            className="bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 shadow-md"
          >
            Save & Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default StatementBuilder;