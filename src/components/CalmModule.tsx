import React, { useState, useEffect } from 'react';
import { Wind, ShieldCheck, RefreshCw } from 'lucide-react';
import type { TriggerEntry } from '../types';

interface Props {
  entry: TriggerEntry;
  onFinish: (finalIntensity: number) => void;
}

const CalmModule: React.FC<Props> = ({ entry: _entry, onFinish }) => {
  const [phase, setPhase] = useState<'ground' | 'breathe' | 'reframe' | 'check'>('ground');
  const [timer, setTimer] = useState(15);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (timer > 0 && !isDone) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    } else if (timer === 0 && !isDone) {
      if (phase === 'ground') { setPhase('breathe'); setTimer(20); }
      else if (phase === 'breathe') { setPhase('reframe'); setTimer(15); }
      else if (phase === 'reframe') { setPhase('check'); setIsDone(true); }
    }
  }, [timer, phase, isDone]);

  const renderContent = () => {
    switch (phase) {
      case 'ground':
        return (
          <div className="text-center animate-in fade-in duration-700">
            <h2 className="text-3xl font-bold text-emerald-900 mb-6 font-accent">Observe</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Notice 3 things you can see right now.<br />
              Notice 2 sounds you can hear.<br />
              Notice 1 physical sensation.
            </p>
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-10 h-10 text-emerald-600" />
            </div>
            <p className="text-slate-400 font-medium">Wait for the moment to settle...</p>
          </div>
        );
      case 'breathe':
        return (
          <div className="text-center animate-in fade-in duration-700">
            <h2 className="text-3xl font-bold text-emerald-900 mb-6 font-accent">Box Breathing</h2>
            <div className="w-48 h-48 rounded-full border-4 border-emerald-200 mx-auto flex items-center justify-center relative mb-12">
              <div className="absolute inset-0 bg-emerald-500 rounded-full breathe-animation"></div>
              <Wind className="w-16 h-16 text-white relative z-10" />
            </div>
            <p className="text-lg text-slate-600 font-medium">Inhale for 4. Hold for 4. Exhale for 4. Hold for 4.</p>
          </div>
        );
      case 'reframe':
        return (
          <div className="text-center animate-in fade-in duration-700">
            <h2 className="text-3xl font-bold text-emerald-900 mb-6 font-accent">Reframe</h2>
            <blockquote className="text-xl italic text-slate-700 mb-8 px-4">
              "This is a difficult moment, but I am in control of how I respond. My partner is likely struggling with their own pain, too."
            </blockquote>
            <p className="text-slate-500">Separating the person from the problem.</p>
          </div>
        );
      case 'check':
        return (
          <div className="text-center animate-in fade-in duration-700">
            <h2 className="text-3xl font-bold text-emerald-900 mb-4 font-accent">How do you feel now?</h2>
            <p className="text-slate-600 mb-8">Has your intensity dropped?</p>
            <div className="grid grid-cols-5 gap-2 mb-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => (
                <button
                  key={v}
                  onClick={() => onFinish(v)}
                  className="h-12 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold hover:bg-emerald-600 hover:text-white transition-colors"
                >
                  {v}
                </button>
              ))}
            </div>
            <button
              onClick={() => { setPhase('ground'); setTimer(15); setIsDone(false); }}
              className="flex items-center justify-center gap-2 mx-auto text-emerald-600 font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Need more time</span>
            </button>
          </div>
        );
    }
  };

  // Skip calm if entry exists but intensity isn't very high — always show but can skip
  const phaseMax = phase === 'breathe' ? 20 : 15;

  return (
    <div className="p-8 flex flex-col justify-between min-h-[90vh]">
      <div className="pt-12">
        {renderContent()}
      </div>

      {!isDone && (
        <div className="text-center">
          <div className="text-5xl font-bold text-emerald-100 mb-4 tabular-nums">{timer}s</div>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-1000"
              style={{ width: `${(timer / phaseMax) * 100}%` }}
            />
          </div>
          <button
            onClick={() => {
              // Allow skipping
              if (phase === 'ground') { setPhase('breathe'); setTimer(20); }
              else if (phase === 'breathe') { setPhase('reframe'); setTimer(15); }
              else if (phase === 'reframe') { setPhase('check'); setIsDone(true); }
            }}
            className="mt-4 text-xs text-slate-300 hover:text-slate-500 transition-colors underline"
          >
            Skip this step
          </button>
        </div>
      )}
    </div>
  );
};

export default CalmModule;
