
import React, { useState } from 'react';
import InterviewPanel from './InterviewPanel';
import ReportView from './ReportView';
import { InterviewResult } from '../types';
import { initialQuestionSets } from '../constants';

interface Props {
  onExit: () => void;
}

const Dashboard: React.FC<Props> = ({ onExit }) => {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<InterviewResult | null>(null);

  const handleEvaluationComplete = (evalResult: InterviewResult) => {
    setResult(evalResult);
    setIsEvaluating(false);
  };

  const startNew = () => {
    setResult(null);
    setCurrentSetIndex((prev) => (prev + 1) % initialQuestionSets.length);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden lg:flex flex-col shrink-0">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Online</span>
          </div>
          
          <nav className="space-y-3">
            <button 
              disabled={!!result}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${!result ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 opacity-50 cursor-not-allowed'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              <span className="font-semibold text-sm">Active Session</span>
            </button>
            <button 
              disabled={!result}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${result ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span className="font-semibold text-sm">Performance Report</span>
            </button>
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-800 bg-slate-900/50">
          <button 
            onClick={onExit}
            className="w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-bold transition-all flex items-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Abort Simulation
          </button>
        </div>
      </aside>

      {/* Main Simulation Area */}
      <section className="flex-grow overflow-y-auto bg-slate-50 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600/10"></div>
        <div className="max-w-4xl mx-auto py-12 px-6">
          {!result ? (
            <InterviewPanel 
              questions={initialQuestionSets[currentSetIndex]} 
              onComplete={handleEvaluationComplete}
              isEvaluating={isEvaluating}
              setIsEvaluating={setIsEvaluating}
            />
          ) : (
            <ReportView result={result} onRestart={startNew} />
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
