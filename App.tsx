
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Homepage from './components/Homepage';
import Dashboard from './components/Dashboard';
import { InterviewResult } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'dashboard'>('home');
  const [result, setResult] = useState<InterviewResult | null>(null);

  const startInterview = () => setView('dashboard');
  const goHome = () => {
    setView('home');
    setResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header onHomeClick={goHome} />
      <main className="flex-grow">
        {view === 'home' ? (
          <Homepage onStart={startInterview} />
        ) : (
          <Dashboard onExit={goHome} />
        )}
      </main>
      <footer className="bg-white border-t py-8 text-center">
        <div className="container mx-auto px-4">
          <p className="text-slate-500 text-sm">
            Research Thesis: "Smart Interview Bot using NLP and Emotion Detection"
          </p>
          <p className="text-slate-400 text-xs mt-1 italic">
            Developed for Final Year Project Submission & Academic Research.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
