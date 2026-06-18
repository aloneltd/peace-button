import React, { useMemo, useState } from 'react';
import { ArrowLeft, Edit2, ChevronRight } from 'lucide-react';
import type { UserPrefs } from '../types';

interface Props {
  prefs: UserPrefs;
  setPrefs: React.Dispatch<React.SetStateAction<UserPrefs>>;
  onBack: () => void;
}

const DotMap: React.FC<Props> = ({ prefs, setPrefs, onBack }) => {
  const [localAge, setLocalAge] = useState<string>(prefs.age?.toString() || '');
  const [localDate, setLocalDate] = useState<string>(prefs.relationshipStart || '');
  const [isConfiguring, setIsConfiguring] = useState(!prefs.age);

  const lifeExpectancy = 80;
  const years = Array.from({ length: lifeExpectancy }, (_, i) => i);

  const stats = useMemo(() => {
    const ageNum = parseInt(localAge);
    if (isNaN(ageNum) || ageNum <= 0) return null;

    const livedWeeks = ageNum * 52;
    const totalWeeks = lifeExpectancy * 52;
    const remainingWeeks = Math.max(0, totalWeeks - livedWeeks);

    let togetherWeeks = 0;
    if (localDate) {
      const start = new Date(localDate).getTime();
      const now = Date.now();
      togetherWeeks = Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24 * 7)));
    }

    const meetingWeek = Math.max(0, livedWeeks - togetherWeeks);

    return { livedWeeks, remainingWeeks, togetherWeeks, totalWeeks, meetingWeek, ageNum };
  }, [localAge, localDate]);

  const handleSave = () => {
    const ageNum = parseInt(localAge);
    if (!isNaN(ageNum) && ageNum > 0) {
      setPrefs(prev => ({ ...prev, age: ageNum, relationshipStart: localDate }));
      setIsConfiguring(false);
    }
  };

  if (isConfiguring) {
    return (
      <div className="flex flex-col h-screen bg-white p-8 animate-in fade-in">
        <header className="mb-10">
          <button onClick={onBack} className="mb-6 p-2 -ml-2 text-slate-400">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-4xl font-black text-slate-900 font-accent tracking-tight leading-none">
            Perspective<br />Setup
          </h1>
        </header>

        <div className="space-y-8 flex-1">
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Current Age</label>
            <input
              type="number"
              inputMode="numeric"
              className="w-full p-6 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all text-2xl font-black text-slate-800"
              placeholder="e.g. 32"
              value={localAge}
              onChange={(e) => setLocalAge(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Relationship Start Date</label>
            <input
              type="date"
              className="w-full p-6 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all text-xl font-black text-slate-800"
              value={localDate}
              onChange={(e) => setLocalDate(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!localAge || !localDate}
          className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-20 mb-4"
        >
          <span>See My Map</span>
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden p-6 pt-8 select-none">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full" />
          <h1 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Life Map</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsConfiguring(true)}
            className="p-2 text-slate-300 hover:text-slate-600 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onBack}
            className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 shrink-0">
        <div className="text-center p-2">
          <p className="text-2xl font-black text-slate-900 leading-none">{stats?.togetherWeeks ?? '—'}</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500 mt-1">Shared Weeks</p>
        </div>
        <div className="text-center p-2">
          <p className="text-2xl font-black text-slate-900 leading-none">{stats?.remainingWeeks ?? '—'}</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mt-1">Weeks Ahead</p>
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center min-h-0 relative overflow-hidden">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(52, minmax(0, 1fr))',
            gap: '1px',
            width: '100%',
            maxHeight: '480px',
          }}
        >
          {years.map(year =>
            Array.from({ length: 52 }).map((_, weekIdx) => {
              const globalWeek = year * 52 + weekIdx;
              const isLived = globalWeek < (stats?.livedWeeks || 0);
              const isRelationship = stats && globalWeek >= stats.meetingWeek && globalWeek < stats.livedWeeks;
              const isNow = globalWeek === (stats?.livedWeeks || 0) - 1;

              return (
                <div
                  key={`${year}-${weekIdx}`}
                  style={{ aspectRatio: '1', width: '4px', borderRadius: '1px' }}
                  className={`transition-colors ${
                    isNow ? 'bg-slate-900' :
                    isRelationship ? 'bg-emerald-500' :
                    isLived ? 'bg-slate-200' : 'bg-slate-50'
                  }`}
                />
              );
            })
          )}
        </div>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6 text-[8px] font-black uppercase tracking-widest text-slate-400 bg-white/80 backdrop-blur-sm py-2 px-4 rounded-full border border-slate-50 shadow-sm w-fit mx-auto">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
            <span>History</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <span>Us</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
            <span>Now</span>
          </div>
        </div>
      </div>

      <div className="shrink-0 pt-8 pb-4 space-y-6">
        <div className="text-center space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Perspective</p>
          <p className="text-sm font-bold text-slate-800 px-4 italic leading-relaxed">
            "Is this argument worth 1 of your {stats?.remainingWeeks ?? '...'} remaining dots?"
          </p>
        </div>

        <button
          onClick={onBack}
          className="w-full py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-50 active:scale-95 transition-all"
        >
          Return to Peace
        </button>
      </div>

      <p className="text-[8px] text-slate-300 text-center uppercase tracking-tighter opacity-50 shrink-0 pb-2">
        Each dot = One Week. Life is too short for escalation.
      </p>
    </div>
  );
};

export default DotMap;
