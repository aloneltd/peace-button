import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  Copy,
  MessageCircle,
  Volume2,
  RefreshCw,
  Clock,
  AlertCircle
} from 'lucide-react';
import type { TriggerEntry, PeacePlan } from '../types';
import { generatePeacePlan } from '../services/aiService';

interface Props {
  entry: TriggerEntry;
  onClose: () => void;
}

const OutputScreen: React.FC<Props> = ({ entry, onClose }) => {
  const [plan, setPlan] = useState<PeacePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copying, setCopying] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'now' | 'later'>('now');

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const p = await generatePeacePlan(entry);
        setPlan(p);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Unknown error';
        setError(`Failed to reach AI helper: ${msg}`);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [entry]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopying(label);
    setTimeout(() => setCopying(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center">
        <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2 font-accent">Creating your peace plan...</h2>
        <p className="text-slate-500 italic">Thinking about {entry.category} and your need for {entry.need}...</p>
      </div>
    );
  }

  if (error && !plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center">
        <AlertCircle className="w-12 h-12 text-orange-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">AI unavailable</h2>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">{error}</p>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 font-accent">The Peace Plan</h1>
        <button onClick={onClose} className="p-2 text-slate-400">
          <CheckCircle className="w-6 h-6 text-emerald-500" />
        </button>
      </header>

      <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
        <button
          onClick={() => setViewMode('now')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'now' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-500'}`}
        >
          Right Now
        </button>
        <button
          onClick={() => setViewMode('later')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'later' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-500'}`}
        >
          Repair Later
        </button>
      </div>

      {viewMode === 'now' ? (
        <div className="space-y-6 animate-in slide-in-from-left-4">
          <section>
            <div className="flex items-center gap-2 mb-3 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <MessageCircle className="w-3 h-3" />
              <span>Message to Send</span>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl relative">
                <p className="text-slate-800 text-sm leading-relaxed pr-8">{plan?.textMessage.soft}</p>
                <button
                  onClick={() => handleCopy(plan?.textMessage.soft || '', 'soft')}
                  className="absolute top-4 right-4 text-emerald-400 hover:text-emerald-600"
                >
                  {copying === 'soft' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <div className="mt-2 text-[10px] text-emerald-600 font-medium italic">Soft variant</div>
              </div>
              <div className="p-4 bg-white border border-slate-100 rounded-2xl relative shadow-sm">
                <p className="text-slate-800 text-sm leading-relaxed pr-8">{plan?.textMessage.direct}</p>
                <button
                  onClick={() => handleCopy(plan?.textMessage.direct || '', 'direct')}
                  className="absolute top-4 right-4 text-slate-300 hover:text-slate-600"
                >
                  {copying === 'direct' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <div className="mt-2 text-[10px] text-slate-400 font-medium italic">Direct variant</div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <Volume2 className="w-3 h-3" />
              <span>What to Say Out Loud</span>
            </div>
            <div className="p-5 bg-slate-900 text-slate-100 rounded-2xl shadow-xl">
              <p className="text-sm leading-relaxed italic">"{plan?.spokenScript}"</p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <RefreshCw className="w-3 h-3" />
              <span>Connection Starter</span>
            </div>
            <div className="p-4 bg-white border-2 border-dashed border-emerald-100 rounded-2xl">
              <p className="text-sm text-slate-700 font-medium">"{plan?.connectionQuestion}"</p>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <Clock className="w-3 h-3" />
              <span>Pause / Boundary</span>
            </div>
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl">
              <p className="text-sm text-orange-800 font-medium leading-relaxed italic">"{plan?.boundaryOption}"</p>
            </div>
          </section>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-right-4">
          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Conversation Prompts</h3>
            <div className="space-y-3">
              {plan?.repairLater.prompts.map((p, i) => (
                <div key={i} className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                  <p className="text-sm text-slate-700 leading-relaxed italic">"{p}"</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-2">The 3-Step Strategy</h3>
            <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl">
              <p className="text-sm text-emerald-900 leading-relaxed whitespace-pre-line">
                {plan?.repairLater.plan}
              </p>
            </div>
          </section>

          <button
            onClick={onClose}
            className="w-full py-4 bg-slate-100 text-slate-600 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <span>Finish Session</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default OutputScreen;
