import React from 'react';
import { ArrowLeft, Shield, Trash2, Download } from 'lucide-react';
import type { UserPrefs } from '../types';

interface Props {
  prefs: UserPrefs;
  setPrefs: React.Dispatch<React.SetStateAction<UserPrefs>>;
  onBack: () => void;
}

const Settings: React.FC<Props> = ({ prefs, setPrefs, onBack }) => {
  const handleClearData = () => {
    if (confirm('Are you sure? This will delete all logged entries.')) {
      localStorage.removeItem('pb_entries');
      window.location.reload();
    }
  };

  const handleExport = () => {
    const data = localStorage.getItem('pb_entries');
    const blob = new Blob([data || '[]'], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `peace-button-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-slate-800 font-accent">Settings</h1>
      </header>

      <div className="space-y-8">
        <section>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Security & Privacy</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-bold text-slate-800 text-sm">Private Mode</p>
                  <p className="text-[10px] text-slate-400">Require passcode to open</p>
                </div>
              </div>
              <button
                onClick={() => setPrefs({ ...prefs, privacyEnabled: !prefs.privacyEnabled })}
                className={`w-12 h-6 rounded-full transition-colors relative ${prefs.privacyEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow ${prefs.privacyEnabled ? 'right-1' : 'left-1'}`} />
              </button>
            </div>

            {prefs.privacyEnabled && (
              <div className="animate-in slide-in-from-top-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Set 4-Digit Passcode</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="1234"
                  className="w-full p-4 rounded-xl border border-slate-200 text-center tracking-widest text-xl font-bold outline-none focus:border-emerald-400"
                  value={prefs.passcode || ''}
                  onChange={(e) => setPrefs({ ...prefs, passcode: e.target.value })}
                />
                <p className="text-[10px] text-slate-400 mt-2 text-center">
                  You'll need this code every time you open the app.
                </p>
              </div>
            )}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Data Management</h3>
          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl text-slate-700 font-medium shadow-sm hover:bg-slate-50 transition-colors"
            >
              <Download className="w-5 h-5 text-slate-400" />
              <span>Export Anonymized Logs</span>
            </button>
            <button
              onClick={handleClearData}
              className="w-full flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl font-medium border border-red-100 hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span>Clear All Data</span>
            </button>
          </div>
        </section>

        <section className="bg-slate-50 p-6 rounded-3xl">
          <h3 className="text-sm font-bold text-slate-800 mb-2">Important Notice</h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Peace Button is a conversational tool designed for self-regulation and relationship communication.
            It is NOT therapy, medical advice, or crisis intervention.
            If you are experiencing domestic violence, coercive control, or fear for your safety,
            please seek immediate professional help or call emergency services.
          </p>
          <div className="mt-4 space-y-1">
            <p className="text-[11px] font-bold text-slate-600">National DV Hotline: 1-800-799-SAFE</p>
            <p className="text-[11px] font-bold text-slate-600">Crisis Text Line: Text HOME to 741741</p>
          </div>
        </section>

        <div className="text-center space-y-1">
          <p className="text-[10px] text-slate-300">Peace Button v1.0.0</p>
          <p className="text-[10px] text-slate-300">Private. On-Device First.</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
