import React from 'react';
import { ArrowLeft, TrendingDown, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { TriggerEntry } from '../types';

interface Props {
  entries: TriggerEntry[];
  onBack: () => void;
}

const Insights: React.FC<Props> = ({ entries, onBack }) => {
  const categories = entries.reduce((acc: Record<string, number>, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(categories).map(k => ({ name: k, count: categories[k] }));

  const avgDrop = entries.length > 0
    ? (entries.reduce((acc, curr) => acc + (curr.intensity - (curr.intensityAfterCalm || curr.intensity)), 0) / entries.length).toFixed(1)
    : 0;

  return (
    <div className="p-6">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-slate-800 font-accent">Weekly Insights</h1>
      </header>

      {entries.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-400">No data logged yet.</p>
          <p className="text-slate-300 text-sm mt-2">Press the button when triggered to start tracking.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 p-4 rounded-2xl">
              <TrendingDown className="w-6 h-6 text-emerald-600 mb-2" />
              <p className="text-2xl font-bold text-emerald-900">{avgDrop} pts</p>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Avg Calm Drop</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <Zap className="w-6 h-6 text-slate-600 mb-2" />
              <p className="text-2xl font-bold text-slate-900">{entries.length}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Sessions</p>
            </div>
          </div>

          {data.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">Common Triggers</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {data.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#64748b'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Recent Logs</h3>
            {entries.slice(0, 8).map(e => (
              <div key={e.id} className="p-4 bg-white border border-slate-100 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-800 capitalize">{e.category}</p>
                  <p className="text-[10px] text-slate-400">{new Date(e.timestamp).toLocaleDateString()} · Need: {e.need}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-emerald-600">
                    {e.intensityAfterCalm !== undefined
                      ? `-${e.intensity - e.intensityAfterCalm} intensity`
                      : `${e.intensity}/10`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Insights;
