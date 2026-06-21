import React, { useState, useEffect, useRef } from 'react';
import type { WOTState } from '../types';

interface CalmModuleProps {
  onDone: (finalIntensity: number, wot: WOTState) => void;
}

type Phase = 'ground' | 'breathe' | 'reframe' | 'intensity' | 'wot';

const GROUND_DURATION = 15000;
const BREATHE_DURATION = 28000;
const REFRAME_DURATION = 12000;

const groundInstructions = [
  'Notice 3 things you can see.',
  'Notice 2 sounds around you.',
  'Notice 1 physical sensation.',
];

const bgColors: Record<string, string> = {
  ground: '#0b1825',
  breathe: '#0d2233',
  reframe: '#1a1428',
  intensity: '#0b1825',
  wot: '#0b1825',
};

const breatheLabels = ['In', 'Hold', 'Out', 'Hold'];

const CalmModule: React.FC<CalmModuleProps> = ({ onDone }) => {
  const [phase, setPhase] = useState<Phase>('ground');
  const [elapsed, setElapsed] = useState(0);
  const [groundIdx, setGroundIdx] = useState(0);
  const [breathStep, setBreathStep] = useState(0);
  const [breathCountdown, setBreathCountdown] = useState(4);
  const [intensity, setIntensity] = useState<number | null>(null);
  const startRef = useRef<number>(Date.now());
  const phaseRef = useRef<Phase>('ground');

  // Main phase timer
  useEffect(() => {
    phaseRef.current = phase;
    startRef.current = Date.now();
    setElapsed(0);

    if (phase === 'ground' || phase === 'breathe' || phase === 'reframe') {
      const duration =
        phase === 'ground' ? GROUND_DURATION :
        phase === 'breathe' ? BREATHE_DURATION :
        REFRAME_DURATION;

      const interval = setInterval(() => {
        const e = Math.min(Date.now() - startRef.current, duration);
        setElapsed(e);
        if (e >= duration) {
          clearInterval(interval);
          if (phaseRef.current === 'ground') setPhase('breathe');
          else if (phaseRef.current === 'breathe') setPhase('reframe');
          else if (phaseRef.current === 'reframe') setPhase('intensity');
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [phase]);

  // Ground: cycle instructions
  useEffect(() => {
    if (phase !== 'ground') return;
    setGroundIdx(0);
    const t1 = setTimeout(() => setGroundIdx(1), 4500);
    const t2 = setTimeout(() => setGroundIdx(2), 9000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [phase]);

  // Breathe: cycle breath steps
  useEffect(() => {
    if (phase !== 'breathe') return;
    setBreathStep(0);
    setBreathCountdown(4);
    let step = 0;
    let countdown = 4;

    const tick = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        step = (step + 1) % 4;
        countdown = 4;
        setBreathStep(step);
      }
      setBreathCountdown(countdown === 0 ? 4 : countdown);
    }, 1000);

    return () => clearInterval(tick);
  }, [phase]);

  const handleIntensitySelect = (val: number) => {
    setIntensity(val);
    setPhase('wot');
  };

  const handleWOT = (w: WOTState) => {
    onDone(intensity ?? 5, w);
  };

  const isInhale = breathStep === 0;
  const innerBg = isInhale ? '#1a6880' : '#0f4a5a';

  const currentDuration =
    phase === 'ground' ? GROUND_DURATION :
    phase === 'breathe' ? BREATHE_DURATION :
    REFRAME_DURATION;

  const progress = (phase === 'ground' || phase === 'breathe' || phase === 'reframe')
    ? (elapsed / currentDuration) * 100
    : 0;

  return (
    <div
      style={{
        background: bgColors[phase],
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 28px',
        position: 'relative',
        transition: 'background-color 700ms ease',
        overflow: 'hidden',
      }}
    >
      {/* Skip link */}
      <button
        onClick={() => onDone(5, 'balanced')}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          background: 'none',
          border: 'none',
          color: '#4a7a8a',
          fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
          fontSize: 13,
          cursor: 'pointer',
          padding: '8px 4px',
        }}
      >
        skip
      </button>

      {/* GROUND PHASE */}
      {phase === 'ground' && (
        <div style={{ textAlign: 'center', width: '100%' }}>
          <p
            style={{
              fontFamily: 'DM Serif Display, Georgia, serif',
              fontSize: 28,
              color: '#c8dce8',
              margin: '0 0 40px',
              fontWeight: 400,
            }}
          >
            Observe
          </p>
          <div style={{ minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p
              key={groundIdx}
              style={{
                fontFamily: 'DM Serif Display, Georgia, serif',
                fontStyle: 'italic',
                fontSize: 20,
                color: '#c8dce8',
                margin: 0,
                lineHeight: 1.5,
                animation: 'fadeUp 0.6s ease-out both',
              }}
            >
              {groundInstructions[groundIdx]}
            </p>
          </div>
        </div>
      )}

      {/* BREATHE PHASE */}
      {phase === 'breathe' && (
        <div style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p
            style={{
              fontFamily: 'DM Serif Display, Georgia, serif',
              fontSize: 28,
              color: '#c8dce8',
              margin: '0 0 32px',
              fontWeight: 400,
            }}
          >
            Breathe
          </p>
          <div
            style={{
              position: 'relative',
              width: 190,
              height: 190,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div className="ring ring-3" style={{ width: 186, height: 186 }} />
            <div className="ring ring-2" style={{ width: 144, height: 144 }} />
            <div className="ring" style={{ width: 104, height: 104 }} />
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: innerBg,
                transition: 'background 1s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <p
                style={{
                  fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
                  fontSize: 11,
                  color: '#e1f5ee',
                  margin: 0,
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {breatheLabels[breathStep]}
              </p>
              <p
                style={{
                  fontFamily: 'DM Serif Display, Georgia, serif',
                  fontSize: 22,
                  color: '#e1f5ee',
                  margin: '2px 0 0',
                }}
              >
                {breathCountdown}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* REFRAME PHASE */}
      {phase === 'reframe' && (
        <div style={{ textAlign: 'center', width: '100%', maxWidth: 320 }}>
          <p
            style={{
              fontFamily: 'DM Serif Display, Georgia, serif',
              fontSize: 28,
              color: '#c8dce8',
              margin: '0 0 32px',
              fontWeight: 400,
            }}
          >
            Reframe
          </p>
          <p
            style={{
              fontFamily: 'DM Serif Display, Georgia, serif',
              fontStyle: 'italic',
              fontSize: 18,
              color: '#c8dce8',
              margin: 0,
              lineHeight: 1.65,
              animation: 'fadeUp 0.7s ease-out both',
            }}
          >
            "This is a hard moment. You are not the conflict — you're the person who stopped to breathe."
          </p>
        </div>
      )}

      {/* INTENSITY PHASE */}
      {phase === 'intensity' && (
        <div
          style={{
            textAlign: 'center',
            width: '100%',
            maxWidth: 340,
            animation: 'fadeUp 0.5s ease-out both',
          }}
        >
          <p
            style={{
              fontFamily: 'DM Serif Display, Georgia, serif',
              fontStyle: 'italic',
              fontSize: 20,
              color: '#c8dce8',
              margin: '0 0 8px',
            }}
          >
            How are you feeling right now?
          </p>
          <p
            style={{
              fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
              fontSize: 13,
              color: '#7fb3c8',
              margin: '0 0 28px',
            }}
          >
            1 = calm &nbsp;·&nbsp; 10 = most activated
          </p>
          <div
            style={{
              display: 'flex',
              gap: 6,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => handleIntensitySelect(n)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  border: '1.5px solid #1a6880',
                  background: 'transparent',
                  color: '#7fb3c8',
                  fontFamily: 'DM Serif Display, Georgia, serif',
                  fontSize: 16,
                  cursor: 'pointer',
                  transition: 'background 0.15s, color 0.15s',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = '#1a6880';
                  el.style.color = '#e1f5ee';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = 'transparent';
                  el.style.color = '#7fb3c8';
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* WOT CHECK PHASE */}
      {phase === 'wot' && (
        <div
          style={{
            textAlign: 'center',
            width: '100%',
            maxWidth: 320,
            animation: 'fadeUp 0.5s ease-out both',
          }}
        >
          <p
            style={{
              fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
              fontSize: 16,
              color: '#7fb3c8',
              margin: '0 0 28px',
              lineHeight: 1.5,
            }}
          >
            Right now, your body feels...
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {([
              { label: 'Too fast', sublabel: 'racing, hot, urgent', value: 'too-fast' },
              { label: 'More balanced', sublabel: 'settling, present', value: 'balanced' },
              { label: 'Too slow', sublabel: 'numb, frozen, flat', value: 'too-slow' },
            ] as { label: string; sublabel: string; value: WOTState }[]).map(({ label, sublabel, value }) => (
              <button
                key={value}
                onClick={() => handleWOT(value)}
                style={{
                  background: 'rgba(26,104,128,0.12)',
                  border: '1.5px solid #1a6880',
                  borderRadius: 14,
                  padding: '16px 20px',
                  color: '#c8dce8',
                  fontFamily: 'DM Serif Display, Georgia, serif',
                  fontStyle: 'italic',
                  fontSize: 17,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(26,104,128,0.28)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(26,104,128,0.12)';
                }}
              >
                <span>{label}</span>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
                    fontStyle: 'normal',
                    fontSize: 12,
                    color: '#7fb3c8',
                    marginTop: 3,
                    fontWeight: 400,
                  }}
                >
                  {sublabel}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Progress bar */}
      {(phase === 'ground' || phase === 'breathe' || phase === 'reframe') && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'rgba(127,179,200,0.12)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: '#1a6880',
              transition: 'width 0.1s linear',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CalmModule;
