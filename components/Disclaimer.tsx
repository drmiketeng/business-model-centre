import React, { useState, useEffect } from 'react';
import { DISCLAIMER_TEXT } from '../constants';

interface DisclaimerProps {
  onAccept: (email: string) => void;
}

const Disclaimer: React.FC<DisclaimerProps> = ({ onAccept }) => {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    setIsFormValid(validateEmail(email) && agreed);
  }, [email, agreed]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onAccept(email);
    }
  };

  return (
    <div className="">
      <div className="text-center mb-8">
        <p className="text-slate-600 text-base">
          The Business Model Centre is a premier hub for strategic business model innovation, dedicated to empowering Small and Medium-sized Enterprises (SMEs), entrepreneurs, and business leaders. Founded on pioneering frameworks, our approach integrates proven methodologies, including the 8 Ps of critical success factors and seven key analytical toolkits, to deliver a holistic business assessment. We guide leaders in navigating dynamic markets, optimizing operations, and achieving sustainable value. Whether you're a startup seeking direction or an established business aiming for transformation, our tools are designed to foster marketability, feasibility and profitability. We are committed to helping you build a robust business model that not only competes but thrives in today's ever-changing landscape, equipping you to unlock your business's full potential.
        </p>
      </div>
      <hr className="my-6 border-slate-200" />
      <h2 className="text-2xl font-bold mb-4 text-slate-800 text-center">Welcome! Please Read Before Proceeding.</h2>
      <div className="text-left bg-slate-100 p-4 rounded-lg max-h-60 overflow-y-auto border border-slate-200 mb-6">
        <pre className="whitespace-pre-wrap font-sans text-sm text-slate-600">{DISCLAIMER_TEXT}</pre>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Your Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            placeholder="you@example.com"
            required
            aria-required="true"
          />
        </div>
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="agree"
              name="agree"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-slate-300 rounded"
              required
              aria-required="true"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="agree" className="font-medium text-slate-700">
              I have read, understood, and agree to the terms.
            </label>
          </div>
        </div>
        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-300"
        >
          Accept and Continue
        </button>
      </form>
    </div>
  );
};

export default Disclaimer;