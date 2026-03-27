import React, { useEffect, useRef, useState } from 'react';
import { marked } from 'marked';
import type { PrayerData } from '../types';

interface ReportDisplayProps {
  report: string;
  prayerData: PrayerData | null;
  onEdit: () => void;
  onFeedback: () => void;
  onReset: () => void;
  onStartTraining: () => void;
}

// Audio decoding utilities
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


const PrayerSection: React.FC<{ prayerData: PrayerData }> = ({ prayerData }) => {
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);

    useEffect(() => {
        // Initialize AudioContext
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        setAudioContext(ctx);

        // Decode audio data when component mounts
        const setupAudio = async () => {
            if (prayerData.audio) {
                try {
                    const decodedBytes = decode(prayerData.audio);
                    const buffer = await decodeAudioData(decodedBytes, ctx, 24000, 1);
                    setAudioBuffer(buffer);
                } catch (error) {
                    console.error("Failed to decode audio:", error);
                }
            }
        };
        setupAudio();

        return () => {
            if (sourceRef.current) {
                sourceRef.current.stop();
            }
            ctx.close();
        }
    }, [prayerData.audio]);

    const togglePlayback = () => {
        if (!audioContext || !audioBuffer) return;

        // AudioContext must be resumed by a user gesture.
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        if (isPlaying && sourceRef.current) {
            sourceRef.current.stop();
            setIsPlaying(false); // Update state immediately to prevent race conditions
        } else {
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.onended = () => {
                setIsPlaying(false);
                sourceRef.current = null;
            };
            source.start();
            sourceRef.current = source;
            setIsPlaying(true);
        }
    };

    return (
        <div className="bg-indigo-50 border-l-4 border-indigo-400 p-6 rounded-r-lg mb-8">
            <h3 className="text-xl font-bold text-indigo-800">A Guidance Prayer for Your Journey</h3>
            <div className="mt-4">
                <button
                    onClick={togglePlayback}
                    disabled={!audioBuffer}
                    className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors duration-300 flex items-center gap-2"
                >
                    {isPlaying ? (
                        <>
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                           Pause Prayer
                        </>
                    ) : (
                        <>
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            Listen to Prayer
                        </>
                    )}
                </button>
            </div>
            <div className="mt-6 text-sm text-indigo-700 whitespace-pre-wrap font-serif italic leading-relaxed">
                {prayerData.script}
            </div>
        </div>
    );
};

const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, prayerData, onEdit, onFeedback, onReset, onStartTraining }) => {
  const reportContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (report && reportContentRef.current) {
      const htmlContent = marked.parse(report, { breaks: true });
      reportContentRef.current.innerHTML = htmlContent as string;
    }
  }, [report]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6 no-print">
        <h2 className="text-2xl font-bold text-slate-800">Your Comprehensive Report</h2>
        <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors duration-300 text-sm"
            >
              Edit Inputs
            </button>
        </div>
      </div>
      
      {prayerData && <PrayerSection prayerData={prayerData} />}

      <div 
        ref={reportContentRef}
        className="professional-report max-w-none"
      >
        {/* Content is rendered here via useEffect */}
      </div>

       <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 no-print">
         <button
            onClick={onFeedback}
            className="w-full sm:w-auto text-center font-semibold text-sky-600 hover:text-sky-800 transition-colors"
          >
            Provide Feedback on this Report
          </button>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
                onClick={onReset}
                className="w-full sm:w-auto bg-slate-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-700 transition-colors duration-300"
            >
                Start a New Analysis
            </button>
            <button
                onClick={onStartTraining}
                className="w-full sm:w-auto bg-sky-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors duration-300"
            >
                Start Interactive Training
            </button>
          </div>
       </div>
    </div>
  );
};

export default ReportDisplay;