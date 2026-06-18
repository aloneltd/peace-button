import React from 'react';
import { ShieldAlert, Phone } from 'lucide-react';

interface Props {
  onAcknowledge: () => void;
}

const SafetyScreen: React.FC<Props> = ({ onAcknowledge }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 animate-in fade-in duration-500">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 text-center mb-2 font-accent">Peace Button</h1>
        <p className="text-slate-500 text-center text-sm mb-8">Private relationship de-escalation</p>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-6">
          <p className="text-sm text-amber-900 font-medium leading-relaxed text-center">
            This app is not a substitute for professional help.{' '}
            <strong>If you're in danger, call 911</strong> or text{' '}
            <strong>HOME to 741741</strong> (Crisis Text Line).
          </p>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">National DV Hotline</p>
              <p className="text-sm font-bold text-slate-800">1-800-799-SAFE (7233)</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Crisis Text Line</p>
              <p className="text-sm font-bold text-slate-800">Text HOME to 741741</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 text-center leading-relaxed mb-6">
          Peace Button helps with communication and self-regulation. It is not therapy, emergency services, or legal advice. All data stays on your device.
        </p>

        <button
          onClick={onAcknowledge}
          className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-base shadow-lg hover:bg-emerald-700 transition-all active:scale-95"
        >
          I Understand — Open App
        </button>
      </div>
    </div>
  );
};

export default SafetyScreen;
