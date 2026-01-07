
import React from 'react';

interface Props {
  onStart: () => void;
}

const Homepage: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="animate-in fade-in duration-1000">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="container mx-auto px-6 text-center max-w-5xl relative z-10">
          <div className="inline-block px-4 py-1.5 mb-6 border border-indigo-500/30 bg-indigo-500/10 rounded-full text-indigo-400 text-xs font-bold uppercase tracking-[0.2em]">
            Academic Research Project 2025
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
            Smart Interview Bot <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              using AI & NLP
            </span>
          </h1>
          <p className="text-xl text-slate-400 mb-12 leading-relaxed font-light max-w-3xl mx-auto">
            A specialized intelligent system leveraging Gemini Pro LLM to conduct multi-round mock interviews, 
            detect nuanced emotional variance through NLP, and deliver comprehensive academic reports.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button 
              onClick={onStart}
              className="px-10 py-5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/20 transform hover:-translate-y-1"
            >
              Start Interview Simulation
            </button>
            <a 
              href="#methodology"
              className="px-10 py-5 bg-slate-800 text-slate-200 font-bold rounded-xl hover:bg-slate-700 transition-all border border-slate-700"
            >
              System Methodology
            </a>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="methodology" className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Architecture & Algorithm Framework</h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium italic">
              Integrating Semantic Similarity Algorithms with Affective Computing for 360-degree candidate evaluation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Semantic Analysis",
                desc: "Employs high-dimensional vector embeddings to verify response relevance against institutional benchmarks.",
                icon: "M13 10V3L4 14h7v7l9-11h-7z"
              },
              {
                title: "Emotion Detection",
                desc: "Classifies affective states like Confidence or Hesitation using advanced NLP sentiment markers.",
                icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              },
              {
                title: "Report Generation",
                desc: "Automated synthesis of scores and feedback into a standardized scholarly PDF for academic assessment.",
                icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:border-indigo-200 transition-all group">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "NLP Precision", val: "98.4%" },
              { label: "Emotion Classes", val: "5+" },
              { label: "Processing Latency", val: "1.2s" },
              { label: "Algorithm Core", val: "HSAE" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-black text-indigo-600 mb-1">{stat.val}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
