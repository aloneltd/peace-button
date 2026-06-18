import React, { useState, useEffect } from 'react';
import {
  Home,
  BarChart2,
  Settings as SettingsIcon,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import type { AppView, TriggerEntry, UserPrefs, TriggerTiming } from './types';
import SafetyScreen from './components/SafetyScreen';
import TriggerHome from './components/TriggerHome';
import IntakeForm from './components/IntakeForm';
import CalmModule from './components/CalmModule';
import OutputScreen from './components/OutputScreen';
import Insights from './components/Insights';
import DotMap from './components/DotMap';
import Settings from './components/Settings';
import './index.css';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [entries, setEntries] = useState<TriggerEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<TriggerEntry | null>(null);
  const [prefs, setPrefs] = useState<UserPrefs>({
    privacyEnabled: false,
    passcode: null,
    age: null,
    relationshipStart: null,
    safetyAcknowledged: false,
  });
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [passcodeInput, setPasscodeInput] = useState('');

  // Load from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('pb_entries');
    const savedPrefs = localStorage.getItem('pb_prefs');
    if (savedEntries) {
      try { setEntries(JSON.parse(savedEntries)); } catch {}
    }
    if (savedPrefs) {
      try {
        const p: UserPrefs = JSON.parse(savedPrefs);
        setPrefs(p);
        if (p.privacyEnabled && p.passcode) {
          setIsUnlocked(false);
        }
      } catch {}
    }
  }, []);

  // Persist entries
  useEffect(() => {
    localStorage.setItem('pb_entries', JSON.stringify(entries));
  }, [entries]);

  // Persist prefs
  useEffect(() => {
    localStorage.setItem('pb_prefs', JSON.stringify(prefs));
  }, [prefs]);

  const handleAcknowledgeSafety = () => {
    setPrefs(prev => ({ ...prev, safetyAcknowledged: true }));
  };

  const handleTrigger = (mode: 'text' | 'person' | 'any', timing: TriggerTiming = 'already') => {
    const newEntry: TriggerEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      intensity: 5,
      category: 'other',
      need: 'be heard',
      riskFactors: [],
      description: '',
      isText: mode === 'text',
      isInPerson: mode === 'person',
      timing,
    };
    setCurrentEntry(newEntry);
    setView('intake');
  };

  const handleFinishIntake = (entry: TriggerEntry) => {
    setCurrentEntry(entry);
    setView('calm');
  };

  const handleFinishCalm = (finalIntensity: number) => {
    if (currentEntry) {
      const updated = { ...currentEntry, intensityAfterCalm: finalIntensity };
      setCurrentEntry(updated);
      setEntries(prev => [updated, ...prev]);
      setView('output');
    }
  };

  // Safety screen — show on first open
  if (!prefs.safetyAcknowledged) {
    return <SafetyScreen onAcknowledge={handleAcknowledgeSafety} />;
  }

  // Passcode lock screen
  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-900 text-white">
        <ShieldCheck className="w-16 h-16 mb-6 text-emerald-400" />
        <h1 className="text-2xl font-bold mb-8 font-accent">Private Mode</h1>
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          placeholder="Enter Passcode"
          className="w-full max-w-xs p-4 bg-slate-800 border border-slate-700 rounded-xl mb-4 text-center text-2xl tracking-widest outline-none focus:border-emerald-400"
          value={passcodeInput}
          onChange={(e) => {
            setPasscodeInput(e.target.value);
            if (e.target.value === prefs.passcode) {
              setIsUnlocked(true);
              setPasscodeInput('');
            }
          }}
        />
        <p className="text-slate-400 text-sm">Passcode required for access</p>
      </div>
    );
  }

  const renderView = () => {
    switch (view) {
      case 'home':
        return <TriggerHome onTrigger={handleTrigger} />;
      case 'intake':
        return currentEntry ? (
          <IntakeForm
            entry={currentEntry}
            onBack={() => setView('home')}
            onNext={handleFinishIntake}
          />
        ) : null;
      case 'calm':
        return currentEntry ? (
          <CalmModule
            entry={currentEntry}
            onFinish={handleFinishCalm}
          />
        ) : null;
      case 'output':
        return currentEntry ? (
          <OutputScreen
            entry={currentEntry}
            onClose={() => setView('home')}
          />
        ) : null;
      case 'log':
        return <Insights entries={entries} onBack={() => setView('home')} />;
      case 'dotmap':
        return <DotMap prefs={prefs} setPrefs={setPrefs} onBack={() => setView('home')} />;
      case 'settings':
        return <Settings prefs={prefs} setPrefs={setPrefs} onBack={() => setView('home')} />;
      default:
        return <TriggerHome onTrigger={handleTrigger} />;
    }
  };

  const showNav = view !== 'intake' && view !== 'calm';

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-white shadow-xl overflow-hidden relative">
      <main className="flex-1 overflow-y-auto pb-24">
        {renderView()}
      </main>

      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-md border-t border-slate-100 px-6 py-3 flex justify-between items-center z-50">
          <button
            onClick={() => setView('home')}
            className={`flex flex-col items-center transition-colors ${view === 'home' ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-medium">Home</span>
          </button>
          <button
            onClick={() => setView('log')}
            className={`flex flex-col items-center transition-colors ${view === 'log' ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            <BarChart2 className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-medium">Insights</span>
          </button>
          <button
            onClick={() => setView('dotmap')}
            className={`flex flex-col items-center transition-colors ${view === 'dotmap' ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-medium">Perspective</span>
          </button>
          <button
            onClick={() => setView('settings')}
            className={`flex flex-col items-center transition-colors ${view === 'settings' ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            <SettingsIcon className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-medium">Settings</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;
