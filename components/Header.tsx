
import React from 'react';

interface Props {
  onHomeClick: () => void;
}

const Header: React.FC<Props> = ({ onHomeClick }) => {
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <button 
          onClick={onHomeClick}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold group-hover:bg-indigo-700 transition-colors">
            S
          </div>
          <span className="font-bold text-slate-800 tracking-tight text-lg">SIB Research</span>
        </button>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button onClick={onHomeClick} className="hover:text-indigo-600 transition-colors">Home</button>
          <a href="#methodology" className="hover:text-indigo-600 transition-colors">Methodology</a>
          <span className="h-4 w-px bg-slate-200"></span>
          <span className="text-slate-400 uppercase text-[10px] tracking-widest">v1.0.4-Alpha</span>
        </nav>
      </div>
    </header>
  );
};

export default Header;
