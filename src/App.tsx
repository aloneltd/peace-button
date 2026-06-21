import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import type { AppView, TriggerEntry, UserPrefs, WOTState, PeacePlan } from './types';
import HomeScreen from './components/HomeScreen';
import SomaticScreen from './components/SomaticScreen';
import CalmModule from './components/CalmModule';
import IntakeForm from './components/IntakeForm';
import PeacePlanScreen from './components/PeacePlan';
import InsightsScreen from './components/InsightsScreen';
import SettingsScreen from './components/SettingsScreen';
import { generatePeacePlan } from './services/aiService';
import './index.css';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [entries, setEntries] = useState<TriggerEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<Partial<TriggerEntry> | null>(null);
  const [currentPlan, setCurrentPlan] = useState<PeacePlan | null>(null);
  const [prefs, setPrefs] = useState<UserPrefs>({
    privacyEnabled: false,
    passcode: null,
    safetyAcknowledged: true,
  });
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [passcodeInput, setPasscodeInput] = useState('');

  // Load from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('pb2_entries');
    const savedPrefs = localStorage.getItem('pb2_prefs');
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
    localStorage.setItem('pb2_entries', JSON.stringify(entries));
  }, [entries]);

  // Persist prefs
  useEffect(() => {
    localStorage.setItem('pb2_prefs', JSON.stringify(prefs));
  }, [prefs]);

  // Flow handlers
  const handleTrigger = () => {
    const entry: Partial<TriggerEntry> = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      intensity: 7, // default; set after calm
    };
    setCurrentEntry(entry);
    setCurrentPlan(null);
    setView('somatic');
  };

  const handleSomaticDone = () => {
    setView('calm');
  };

  const handleCalmDone = (finalIntensity: number, wot: WOTState) => {
    setCurrentEntry(prev => prev
      ? { ...prev, intensityAfterCalm: finalIntensity, wot }
      : null
    );
    setView('intake');
  };

  const handleIntakeDone = (description?: string) => {
    setCurrentEntry(prev => {
      const updated = prev ? { ...prev, description } : null;
      // Kick off AI call
      if (updated) {
        generatePeacePlan(updated, entries).then(plan => {
          setCurrentPlan(plan);
        });
      }
      return updated;
    });
    setView('plan');
  };

  const handlePlanClose = () => {
    if (currentEntry && currentEntry.id) {
      const completed: TriggerEntry = {
        id: currentEntry.id,
        timestamp: currentEntry.timestamp ?? Date.now(),
        intensity: currentEntry.intensity ?? 5,
        intensityAfterCalm: currentEntry.intensityAfterCalm,
        wot: currentEntry.wot,
        description: currentEntry.description,
      };
      setEntries(prev => [completed, ...prev]);
    }
    setCurrentEntry(null);
    setCurrentPlan(null);
    setView('home');
  };

  // Passcode lock
  if (prefs.privacyEnabled && !isUnlocked) {
    return (
      <div
        style={{
          background: '#0b1825',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 28px',
        }}
      >
        <ShieldCheck size={48} color="#7fb3c8" style={{ marginBottom: 24 }} />
        <p
          style={{
            fontFamily: 'DM Serif Display, Georgia, serif',
            fontSize: 22,
            color: '#c8dce8',
            margin: '0 0 28px',
          }}
        >
          Private Mode
        </p>
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          placeholder="····"
          style={{
            width: '100%',
            maxWidth: 200,
            padding: '14px',
            background: 'rgba(26,104,128,0.12)',
            border: '1.5px solid #1a6880',
            borderRadius: 12,
            textAlign: 'center',
            fontSize: 24,
            letterSpacing: '0.3em',
            color: '#c8dce8',
            outline: 'none',
            fontFamily: 'DM Serif Display, Georgia, serif',
            marginBottom: 12,
          }}
          value={passcodeInput}
          onChange={e => {
            setPasscodeInput(e.target.value);
            if (e.target.value === prefs.passcode) {
              setIsUnlocked(true);
              setPasscodeInput('');
            }
          }}
        />
        <p
          style={{
            fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
            fontSize: 13,
            color: '#4a7a8a',
          }}
        >
          Enter your passcode to continue
        </p>
      </div>
    );
  }

  const showNav = view === 'home' || view === 'insights' || view === 'settings';

  const renderView = () => {
    switch (view) {
      case 'home':
        return (
          <HomeScreen
            onTrigger={handleTrigger}
            onNavigate={setView}
            currentView={view}
          />
        );
      case 'somatic':
        return <SomaticScreen onDone={handleSomaticDone} />;
      case 'calm':
        return <CalmModule onDone={handleCalmDone} />;
      case 'intake':
        return <IntakeForm onDone={handleIntakeDone} />;
      case 'plan':
        return (
          <PeacePlanScreen
            plan={currentPlan}
            entry={currentEntry ?? {}}
            onClose={handlePlanClose}
          />
        );
      case 'insights':
        return <InsightsScreen entries={entries} onBack={() => setView('home')} />;
      case 'settings':
        return (
          <SettingsScreen
            prefs={prefs}
            setPrefs={setPrefs}
            onBack={() => setView('home')}
          />
        );
      default:
        return (
          <HomeScreen
            onTrigger={handleTrigger}
            onNavigate={setView}
            currentView={view}
          />
        );
    }
  };

  return (
    <div
      style={{
        maxWidth: 480,
        margin: '0 auto',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {renderView()}

      {/* Nav — only on home/insights/settings, and HomeScreen renders its own nav */}
      {/* InsightsScreen and SettingsScreen have their own back buttons */}
      {showNav && view !== 'home' && (
        <nav
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            maxWidth: 480,
            margin: '0 auto',
            background: '#f5f0e8',
            borderTop: '1px solid #e8e2d8',
            display: 'flex',
            justifyContent: 'center',
            gap: 56,
            padding: '12px 0 20px',
            zIndex: 50,
          }}
        >
        </nav>
      )}
    </div>
  );
};

export default App;
