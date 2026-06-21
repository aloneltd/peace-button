import React from 'react';
import { Heart, BarChart2, Settings } from 'lucide-react';
import type { AppView } from '../types';

interface HomeScreenProps {
  onTrigger: () => void;
  onNavigate: (view: AppView) => void;
  currentView: AppView;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onTrigger, onNavigate, currentView }) => {
  return (
    <div
      style={{
        background: '#0b1825',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(26,104,128,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
        {/* Breathing sphere */}
        <div
          style={{
            position: 'relative',
            width: 180,
            height: 180,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div className="ring ring-3" style={{ width: 172, height: 172 }} />
          <div className="ring ring-2" style={{ width: 130, height: 130 }} />
          <div className="ring" style={{ width: 90, height: 90 }} />
          <button
            onClick={onTrigger}
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#1a6880',
              border: 'none',
              cursor: 'pointer',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 24px rgba(26,104,128,0.45)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            aria-label="I'm triggered"
            onMouseDown={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.93)';
            }}
            onMouseUp={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            }}
          >
            <Heart size={26} color="#e1f5ee" fill="#e1f5ee" />
          </button>
        </div>

        {/* Labels */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p
            style={{
              fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
              fontSize: 11,
              color: '#4a7a8a',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              margin: 0,
              fontWeight: 500,
            }}
          >
            Peace Button
          </p>
          <p
            className="font-serif"
            style={{
              fontFamily: 'DM Serif Display, Georgia, serif',
              fontStyle: 'italic',
              fontSize: 17,
              color: '#c8dce8',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Tap when you need to find your way back.
          </p>
        </div>
      </div>

      {/* Bottom nav */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#0b1825',
          borderTop: '1px solid #1a3040',
          display: 'flex',
          justifyContent: 'center',
          gap: 56,
          padding: '12px 0 20px',
          zIndex: 50,
        }}
      >
        <button
          onClick={() => onNavigate('insights')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            color: currentView === 'insights' ? '#7fb3c8' : '#4a7a8a',
            transition: 'color 0.2s',
          }}
          aria-label="Insights"
        >
          <BarChart2 size={22} />
          <span style={{ fontSize: 10, fontFamily: 'Plus Jakarta Sans', letterSpacing: '0.05em' }}>
            Insights
          </span>
        </button>
        <button
          onClick={() => onNavigate('settings')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            color: currentView === 'settings' ? '#7fb3c8' : '#4a7a8a',
            transition: 'color 0.2s',
          }}
          aria-label="Settings"
        >
          <Settings size={22} />
          <span style={{ fontSize: 10, fontFamily: 'Plus Jakarta Sans', letterSpacing: '0.05em' }}>
            Settings
          </span>
        </button>
      </nav>
    </div>
  );
};

export default HomeScreen;
