import React, { useState } from 'react';

interface FeedbackFormProps {
    onSubmit: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit }) => {
    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Feedback submitted:", { feedback });
        // Here you would typically send the feedback to a backend service like Bolt.
        // For this example, we'll just show a thank you message.
        setSubmitted(true);
        setTimeout(onSubmit, 2000); // Navigate away after 2 seconds
    };

    if (submitted) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-green-600">Thank You!</h2>
                <p className="text-slate-600 mt-2">Your feedback has been received and is greatly appreciated.</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Provide Feedback</h2>
            <p className="text-slate-600 mb-6">We'd love to hear your thoughts on the report quality, the process, or any suggestions you have for improvement.</p>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                    placeholder="Enter your feedback here..."
                    required
                />
                <div className="flex justify-end mt-4">
                    <button
                        type="submit"
                        className="bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 shadow-md"
                    >
                        Submit Feedback
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FeedbackForm;
