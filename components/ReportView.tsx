
import React from 'react';
import { InterviewResult, EmotionType } from '../types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Props {
  result: InterviewResult;
  onRestart: () => void;
}

const ReportView: React.FC<Props> = ({ result, onRestart }) => {
  const getEmotionStyles = (emotion: EmotionType) => {
    switch (emotion) {
      case EmotionType.CONFIDENT: 
        return {
          color: 'text-green-600 bg-green-50 border-green-200',
          bar: 'bg-green-500',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      case EmotionType.ENTHUSIASTIC: 
        return {
          color: 'text-blue-600 bg-blue-50 border-blue-200',
          bar: 'bg-blue-500',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          )
        };
      case EmotionType.NERVOUS: 
        return {
          color: 'text-orange-600 bg-orange-50 border-orange-200',
          bar: 'bg-orange-500',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )
        };
      case EmotionType.HESITANT: 
        return {
          color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
          bar: 'bg-yellow-500',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      default: 
        return {
          color: 'text-slate-600 bg-slate-50 border-slate-200',
          bar: 'bg-slate-400',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          )
        };
    }
  };

  const downloadReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('SMART INTERVIEW BOT', 15, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text('ACADEMIC PERFORMANCE EVALUATION REPORT', 15, 28);
    doc.text(`DATE: ${result.timestamp}`, pageWidth - 15, 28, { align: 'right' });

    // Summary Section
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('EXECUTIVE SUMMARY', 15, 55);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Overall Professional Rating: ${result.overallScore} / 10`, 15, 65);
    doc.text(`Candidate ID: AI-2025-RT-402`, 15, 72);

    // Detailed Question-Answer Table
    const tableData = result.items.map((item, index) => [
      `Q${index + 1}`,
      item.questionText,
      item.score,
      item.emotion,
      item.feedback
    ]);

    autoTable(doc, {
      startY: 85,
      head: [['ID', 'Interview Question', 'Score', 'Emotion', 'AI Analysis']],
      body: tableData,
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255] }, // indigo-600
      alternateRowStyles: { fillColor: [248, 250, 252] }, // slate-50
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 50 },
        2: { cellWidth: 15 },
        3: { cellWidth: 25 },
        4: { cellWidth: 'auto' },
      },
      styles: { fontSize: 9, overflow: 'linebreak' },
    });

    // Strategy Section
    const finalY = (doc as any).lastAutoTable.cursor.y + 15;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DEVELOPMENT STRATEGIES', 15, finalY);

    let strategyY = finalY + 10;
    result.items.forEach((item, index) => {
      if (strategyY > 270) {
        doc.addPage();
        strategyY = 20;
      }
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Question ${index + 1} Suggestions:`, 15, strategyY);
      doc.setFont('helvetica', 'normal');
      const splitText = doc.splitTextToSize(item.suggestions, pageWidth - 30);
      doc.text(splitText, 15, strategyY + 5);
      strategyY += (splitText.length * 5) + 12;
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 285, { align: 'center' });
      doc.text('SIB Research Platform - Confident & Confidential Evaluation', 15, 285);
    }

    doc.save(`Interview_Report_${Date.now()}.pdf`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold">Comprehensive Evaluation</h2>
            <p className="text-slate-400 mt-1 uppercase text-[10px] tracking-[0.2em] font-bold">Project Ref: AI-2025-RT-402</p>
          </div>
          <div className="flex flex-col items-center bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="text-5xl font-black text-indigo-400">{result.overallScore}</div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1">Overall Rating</div>
          </div>
        </div>

        <div className="p-6 md:p-10 space-y-12">
          {result.items.map((item, index) => {
            const styles = getEmotionStyles(item.emotion);
            return (
              <div key={index} className="relative group">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Visual Sidebar Indicator */}
                  <div className="hidden md:flex flex-col items-center gap-3 w-16 pt-2">
                    <div className="text-sm font-black text-slate-300">Q{index + 1}</div>
                    <div className="w-1.5 h-full rounded-full bg-slate-100 relative overflow-hidden">
                      <div className={`absolute top-0 left-0 w-full h-1/3 rounded-full transition-all duration-1000 ${styles.bar}`}></div>
                    </div>
                  </div>

                  <div className="flex-grow space-y-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <h4 className="text-xl font-bold text-slate-800 leading-tight flex-grow max-w-2xl">
                        {item.questionText}
                      </h4>
                      <div className="flex items-center gap-3 shrink-0">
                        {/* Emotion Tag with Icon */}
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-xs font-black uppercase tracking-wider shadow-sm transition-transform hover:scale-105 ${styles.color}`}>
                          {styles.icon}
                          {item.emotion}
                        </div>
                        {/* Score Tag */}
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-wider shadow-md">
                          Score: {item.score}/10
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-4 top-0 bottom-0 w-1 bg-indigo-500/10 rounded-full"></div>
                      <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 text-slate-600 italic leading-relaxed text-sm">
                        <span className="text-indigo-400 font-serif text-3xl absolute -top-2 -left-2 opacity-20">"</span>
                        {item.answerText}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 pt-2">
                      <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Linguistic Analysis</p>
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed font-medium">{item.feedback}</p>
                      </div>
                      <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1.5 h-4 bg-cyan-500 rounded-full"></div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Optimization Strategy</p>
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed font-medium">{item.suggestions}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-4">
        <button
          onClick={downloadReport}
          className="group w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-500 shadow-2xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1"
        >
          <svg className="w-6 h-6 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Scholarly Report
        </button>
        <button
          onClick={onRestart}
          className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-black hover:border-slate-900 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          Conduct Next Module
        </button>
      </div>
    </div>
  );
};

export default ReportView;
