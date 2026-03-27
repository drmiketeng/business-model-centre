import React, { useState, useRef, useEffect } from 'react';
import { getAssistantResponse } from '../services/geminiService';

interface Message {
    text: string;
    isUser: boolean;
}

const Assistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { text: "Hello! I am the Business Model Assistant. How can I help you understand this tool?", isUser: false }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleToggle = () => setIsOpen(!isOpen);

    const handleSend = async () => {
        if (!userInput.trim()) return;

        const newMessages: Message[] = [...messages, { text: userInput, isUser: true }];
        setMessages(newMessages);
        setUserInput('');
        setIsLoading(true);

        try {
            const response = await getAssistantResponse(userInput);
            setMessages(prev => [...prev, { text: response, isUser: false }]);
        } catch (error) {
            console.error("Assistant error:", error);
            setMessages(prev => [...prev, { text: "Sorry, I encountered an error. Please try again.", isUser: false }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <>
            <button
                onClick={handleToggle}
                className="fixed bottom-6 right-6 bg-sky-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-sky-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 z-50"
                aria-label="Toggle Business Model Assistant"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.09 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
            </button>
            
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-full max-w-sm h-[60vh] bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col z-50 animate-fade-in-up">
                    <header className="bg-slate-100 p-4 rounded-t-xl border-b border-slate-200 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Business Model Assistant</h3>
                        <button onClick={handleToggle} className="text-slate-500 hover:text-slate-800 text-2xl leading-none">&times;</button>
                    </header>
                    <div className="flex-1 p-4 overflow-y-auto">
                        <div className="space-y-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-lg ${msg.isUser ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
                                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-200 text-slate-800 p-3 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                                            <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                    <footer className="p-4 border-t border-slate-200">
                        <div className="flex items-center gap-2">
                            <textarea
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask a question..."
                                rows={1}
                                maxLength={200}
                                className="flex-1 resize-none w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                            />
                            <button onClick={handleSend} disabled={isLoading || !userInput.trim()} className="bg-sky-600 text-white p-2 rounded-md hover:bg-sky-700 disabled:bg-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                            </button>
                        </div>
                        <p className="text-xs text-slate-400 text-right mt-1">{userInput.length}/200</p>
                    </footer>
                </div>
            )}
            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
            `}</style>
        </>
    );
};

export default Assistant;