import React from 'react';
import { ShieldAlert, Zap, MessageSquare, Users, Clock, AlertCircle } from 'lucide-react';
import type { TriggerTiming } from '../types';

interface Props {
  onTrigger: (mode: 'text' | 'person' | 'any', timing?: TriggerTiming) => void;
}

const TriggerHome: React.FC<Props> = ({ onTrigger }) => {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[80vh]">
      <header className="text-center mb-10">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold font-accent text-slate-800">Peace Button</h1>
        <p className="text-slate-500 mt-2">Private relationship de-escalation</p>
      </header>

      <div className="grid grid-cols-2 gap-3 w-full mb-8">
        <button
          onClick={() => onTrigger('any', 'before')}
          className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-emerald-200 transition-all group"
        >
          <Clock className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">Before it starts</span>
        </button>
        <button
          onClick={() => onTrigger('any', 'already')}
          className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-orange-200 transition-all group"
        >
          <AlertCircle className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">Already started</span>
        </button>
      </div>

      <div className="relative group mb-10">
        <div className="absolute -inset-4 bg-emerald-100 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>
        <button
          onClick={() => onTrigger('any')}
          className="relative w-44 h-44 bg-emerald-600 rounded-full shadow-2xl flex flex-col items-center justify-center transition-transform hover:scale-105 active:scale-95 z-10"
        >
          <Zap className="w-10 h-10 text-white mb-2" />
          <span className="text-white font-bold text-lg tracking-wide uppercase">I'm Triggered</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        <button
          onClick={() => onTrigger('text')}
          className="flex items-center justify-center gap-2 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors"
        >
          <MessageSquare className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-medium text-slate-700">In Text</span>
        </button>
        <button
          onClick={() => onTrigger('person')}
          className="flex items-center justify-center gap-2 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors"
        >
          <Users className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-medium text-slate-700">In Person</span>
        </button>
      </div>

      <div className="mt-10 text-center max-w-[280px]">
        <p className="text-[10px] text-slate-400 leading-relaxed italic">
          "The space between stimulus and response is where your power lies."
        </p>
      </div>
    </div>
  );
};

export default TriggerHome;
