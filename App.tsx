import React, { useState, useEffect, useMemo } from 'react';
import { SignalType } from './types';
import { generateData } from './utils/signalMath';
import { SignalSelector, CaseInfoCard } from './components/SignalControls';
import Charts from './components/Charts';

const App: React.FC = () => {
  const [signalType, setSignalType] = useState<SignalType>(SignalType.RECTANGULAR);
  const [lag, setLag] = useState<number>(-8); 
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setLag(prevLag => {
          if (prevLag >= 15) {
            setIsPlaying(false);
            return 15;
          }
          return prevLag + 1;
        });
      }, 400); 
    }
    return () => window.clearInterval(interval);
  }, [isPlaying]);

  const { signalData, correlationData } = useMemo(() => {
    return generateData(lag, signalType);
  }, [lag, signalType]);

  return (
    <div className="min-h-screen bg-[#0b1121] text-slate-200 font-sans selection:bg-primary-500/30 pb-12 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
      
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             </div>
             <div>
                <h1 className="text-lg font-bold text-slate-100 tracking-tight leading-none">AutoCorrelation <span className="text-primary-400">Lab</span></h1>
                <p className="text-[10px] text-slate-500 font-mono tracking-wider">DSP INTERACTIVE LEARNING</p>
             </div>
          </div>
          <div className="hidden md:block">
             <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-400">
               v1.0.0
             </span>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Left Column: Interactions & Visuals (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* 1. Math Header */}
            <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl border border-slate-700/50 p-6 shadow-xl flex items-center justify-between overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>
               </div>
               <div className="relative z-10">
                  <span className="text-xs font-bold text-accent-400 uppercase tracking-widest mb-1 block">Mathematical Definition</span>
                  <div className="text-2xl sm:text-3xl font-serif text-white tracking-wide">
                    R<sub>x</sub>(m) = <span className="text-slate-500 mx-1">∫</span> <span className="text-primary-400">x(t)</span> · <span className="text-amber-500">x*(t-m)</span> dt
                  </div>
               </div>
               <div className="hidden sm:block text-right relative z-10 max-w-xs">
                 <p className="text-xs text-slate-400 leading-relaxed">
                   The convolution of a signal with a time-reversed version of itself. 
                   Measures similarity as a function of time lag.
                 </p>
               </div>
            </div>

            {/* 2. Controls */}
            <SignalSelector 
              signalType={signalType} 
              setSignalType={setSignalType} 
              lag={lag} 
              setLag={setLag} 
              isPlaying={isPlaying} 
              setIsPlaying={setIsPlaying}
            />

            {/* 3. Charts */}
            <div className="flex-1 min-h-[500px]">
               <Charts 
                  signalData={signalData} 
                  correlationData={correlationData}
                  currentLag={lag}
                />
            </div>
          </div>

          {/* Right Column: Learning Context (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* 1. Case Study Info */}
            <div className="space-y-6 sticky top-24">
               <CaseInfoCard signalType={signalType} />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;