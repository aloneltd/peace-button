import React, { useState, useMemo } from 'react';
import { ArrowLeft, ChevronRight, AlertTriangle, ShieldAlert } from 'lucide-react';
import type { TriggerEntry, TopicCategory, UserNeed, RiskFactor } from '../types';
import { CATEGORIES, BASE_NEEDS, CATEGORY_SPECIFIC_NEEDS, RISK_FACTORS, CRISIS_RESOURCES } from '../constants';

interface Props {
  entry: TriggerEntry;
  onBack: () => void;
  onNext: (entry: TriggerEntry) => void;
}

const IntakeForm: React.FC<Props> = ({ entry, onBack, onNext }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [localEntry, setLocalEntry] = useState<TriggerEntry>(entry);
  const [showSafety, setShowSafety] = useState(false);

  const steps = useMemo(() => {
    if (localEntry.timing === 'before') {
      return ['need', 'category', 'description', 'risk', 'intensity'];
    }
    return ['intensity', 'category', 'need', 'risk', 'description'];
  }, [localEntry.timing]);

  const stepKey = steps[stepIndex];

  const availableNeeds = useMemo(() => {
    const specific = CATEGORY_SPECIFIC_NEEDS[localEntry.category] || [];
    const combined = [...BASE_NEEDS.map(n => n.value)] as UserNeed[];
    specific.forEach(s => {
      if (!combined.includes(s)) combined.push(s);
    });
    return combined;
  }, [localEntry.category]);

  const checkSafety = (text: string, currentEntry: TriggerEntry) => {
    const dangerWords = ['hit', 'hurt', 'kill', 'suicide', 'abuse', 'violence', 'die', 'harm', 'punch', 'slap'];
    const hasDangerWords = dangerWords.some(word => text.toLowerCase().includes(word));
    const highIntensityDanger = currentEntry.intensity === 10 && currentEntry.riskFactors.includes('blamed');
    if (hasDangerWords || highIntensityDanger) {
      setShowSafety(true);
    }
  };

  const nextStep = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      onNext(localEntry);
    }
  };

  if (showSafety) {
    return (
      <div className="p-6 bg-red-50 min-h-screen">
        <div className="bg-white p-6 rounded-3xl shadow-2xl border border-red-100 animate-in zoom-in-95">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <ShieldAlert className="w-10 h-10" />
            <h2 className="text-2xl font-bold">Safety First</h2>
          </div>
          <p className="text-slate-700 mb-6 font-medium leading-relaxed">
            {CRISIS_RESOURCES.text} If you feel you are in immediate danger or might harm yourself or others, please stop and call for help now.
          </p>
          <div className="space-y-4 mb-8">
            {CRISIS_RESOURCES.numbers.map((n, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] text-slate-500 uppercase font-black mb-1 tracking-widest">{n.name}</p>
                <p className="text-lg font-bold text-slate-900">{n.phone}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowSafety(false)}
            className="w-full p-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg"
          >
            I'm safe, back to app
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-10">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${stepIndex >= i ? 'bg-emerald-500 w-10' : 'bg-slate-200 w-6'}`}
            />
          ))}
        </div>
      </header>

      <div className="min-h-[55vh]">
        {stepKey === 'intensity' && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 font-accent">How intense is this?</h2>
            <p className="text-slate-500 mb-8">From 0 (Calm) to 10 (Explosive)</p>
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                <button
                  key={val}
                  onClick={() => {
                    const newEntry = { ...localEntry, intensity: val };
                    setLocalEntry(newEntry);
                    checkSafety(newEntry.description, newEntry);
                  }}
                  className={`h-14 rounded-xl text-lg font-bold transition-all ${localEntry.intensity === val ? 'bg-emerald-600 text-white shadow-lg scale-110' : 'bg-white border border-slate-100 text-slate-600'}`}
                >
                  {val}
                </button>
              ))}
            </div>
            {localEntry.intensity >= 8 && (
              <div className="mt-6 p-4 bg-orange-50 rounded-2xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-xs text-orange-800 leading-relaxed font-medium">
                  Intensity is high. We will focus on finding space to cool down after the exercises.
                </p>
              </div>
            )}
          </div>
        )}

        {stepKey === 'category' && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 font-accent">What's the topic?</h2>
            <p className="text-slate-500 mb-8">Choose the primary area of friction.</p>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setLocalEntry({ ...localEntry, category: cat.value as TopicCategory })}
                  className={`p-4 rounded-2xl flex items-center gap-3 transition-all border ${localEntry.category === cat.value ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-100 text-slate-600 shadow-sm'}`}
                >
                  {cat.icon}
                  <span className="font-bold text-sm">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {stepKey === 'need' && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 font-accent">What do you need?</h2>
            <p className="text-slate-500 mb-8">Identifying your unmet need helps resolve it.</p>
            <div className="grid grid-cols-1 gap-2.5 max-h-[40vh] overflow-y-auto pr-1">
              {availableNeeds.map(need => (
                <button
                  key={need}
                  onClick={() => setLocalEntry({ ...localEntry, need: need as UserNeed })}
                  className={`w-full p-4 rounded-xl text-left font-bold capitalize transition-all border ${localEntry.need === need ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-100 text-slate-600 shadow-sm'}`}
                >
                  {need}
                </button>
              ))}
            </div>
          </div>
        )}

        {stepKey === 'risk' && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 font-accent">Risk check</h2>
            <p className="text-slate-500 mb-8">Select anything that feels true right now.</p>
            <div className="space-y-3">
              {RISK_FACTORS.map(rf => (
                <button
                  key={rf.value}
                  onClick={() => {
                    const factors = [...localEntry.riskFactors];
                    const idx = factors.indexOf(rf.value as RiskFactor);
                    if (idx > -1) factors.splice(idx, 1);
                    else factors.push(rf.value as RiskFactor);
                    const updatedEntry = { ...localEntry, riskFactors: factors };
                    setLocalEntry(updatedEntry);
                    checkSafety(updatedEntry.description, updatedEntry);
                  }}
                  className={`w-full p-4 rounded-2xl text-left font-bold transition-all border ${localEntry.riskFactors.includes(rf.value as RiskFactor) ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-inner' : 'bg-white border-slate-100 text-slate-600 shadow-sm'}`}
                >
                  {rf.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {stepKey === 'description' && (
          <div className="animate-in fade-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 font-accent">What happened?</h2>
            <p className="text-slate-500 mb-8">One sentence about the trigger point.</p>
            <textarea
              className="w-full h-40 p-5 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 outline-none resize-none transition-all text-slate-700 font-medium leading-relaxed"
              placeholder="e.g., We started arguing about dinner plans and it escalated into how I never plan anything."
              maxLength={240}
              value={localEntry.description}
              onChange={(e) => {
                const text = e.target.value;
                const updated = { ...localEntry, description: text };
                setLocalEntry(updated);
                checkSafety(text, updated);
              }}
            />
            <div className="mt-2 text-right text-[10px] font-black uppercase text-slate-300 tracking-widest">
              {localEntry.description.length} / 240
            </div>
          </div>
        )}
      </div>

      <button
        onClick={nextStep}
        className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all active:scale-95"
      >
        <span>{stepIndex === steps.length - 1 ? 'Process & Calm' : 'Continue'}</span>
        <ChevronRight className="w-5 h-5" />
      </button>

      <p className="text-center text-[10px] text-slate-400 mt-6 font-medium italic">
        Your data is private and stored only on this device.
      </p>
    </div>
  );
};

export default IntakeForm;
