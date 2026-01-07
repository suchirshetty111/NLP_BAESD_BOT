
import React, { useState } from 'react';
import { Question, UserAnswer, InterviewResult } from '../types';
import { evaluateInterview } from '../services/geminiService';
import VoiceInput from './VoiceInput';

interface Props {
  questions: Question[];
  onComplete: (result: InterviewResult) => void;
  isEvaluating: boolean;
  setIsEvaluating: (val: boolean) => void;
}

const InterviewPanel: React.FC<Props> = ({ questions, onComplete, isEvaluating, setIsEvaluating }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleInputChange = (text: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentStep].id]: text
    }));
  };

  const handleVoiceTranscript = (transcript: string) => {
    const currentId = questions[currentStep].id;
    const existing = answers[currentId] || '';
    handleInputChange(existing + (existing ? ' ' : '') + transcript);
  };

  const handleSubmit = async () => {
    const allAnswered = questions.every(q => answers[q.id]?.trim().length >= 10);
    if (!allAnswered) {
      setError("Academic integrity requires substantial answers for all modules (min 10 chars).");
      return;
    }

    setError(null);
    setIsEvaluating(true);
    
    try {
      const payload: UserAnswer[] = questions.map(q => ({
        questionId: q.id,
        questionText: q.text,
        answerText: answers[q.id]
      }));
      const result = await evaluateInterview(payload);
      onComplete(result);
    } catch (err) {
      setError("System Link Error: Ensure your AI environment variables are configured correctly.");
      setIsEvaluating(false);
    }
  };

  const currentQuestion = questions[currentStep];
  const progress = (Object.keys(answers).length / questions.length) * 100;

  if (isEvaluating) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative mb-8">
          <div className="w-24 h-24 border-4 border-indigo-100 rounded-full"></div>
          <div className="absolute inset-0 w-24 h-24 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Neural Analysis in Progress</h2>
        <div className="flex gap-2 mb-4">
          <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase animate-pulse">Semantic Check</span>
          <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase animate-pulse delay-75">Affective Computing</span>
          <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase animate-pulse delay-150">Scoring Engine</span>
        </div>
        <p className="text-slate-500 text-sm max-w-xs text-center">
          The Gemini Pro model is cross-referencing your inputs with professional competency benchmarks.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 transition-all">
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Question Module {currentStep + 1} of 4</span>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">{Math.round(progress)}% Answered</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-600 h-full transition-all duration-700 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-10 min-h-[120px]">
        <h3 className="text-3xl font-extrabold text-slate-900 leading-tight">
          {currentQuestion.text}
        </h3>
      </div>
      
      <div className="relative mb-8 group">
        <textarea
          className="w-full min-h-[250px] p-8 text-lg border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:ring-0 outline-none transition-all resize-none bg-slate-50 font-medium text-slate-700"
          placeholder="Formulate your professional response here..."
          value={answers[currentQuestion.id] || ''}
          onChange={(e) => handleInputChange(e.target.value)}
        />
        <div className="absolute bottom-6 right-6 flex items-center gap-3">
          <div className="text-[10px] font-bold text-slate-400 uppercase hidden sm:block">Voice Assist Available</div>
          <VoiceInput onTranscript={handleVoiceTranscript} />
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      )}

      <div className="flex justify-between items-center pt-8 border-t border-slate-50">
        <button
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="px-6 py-3 font-bold text-slate-400 disabled:opacity-0 hover:text-slate-900 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Module Back
        </button>
        
        {currentStep === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="px-10 py-4 bg-indigo-600 text-white font-black rounded-xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 hover:-translate-y-1 transition-all"
          >
            Submit for AI Review
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-8 py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            Next Module
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default InterviewPanel;
