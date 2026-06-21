import React from 'react';
import { Info } from 'lucide-react';
import type { PeacePlan as PeacePlanType, TriggerEntry } from '../types';

interface PeacePlanProps {
  plan: PeacePlanType | null;
  entry: Partial<TriggerEntry>;
  onClose: () => void;
}

const Card: React.FC<{
  accent: string;
  labelColor: string;
  label: string;
  text: string;
  delay: number;
}> = ({ accent, labelColor, label, text, delay }) => (
  <div
    style={{
      display: 'flex',
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 10,
      animation: 'fadeUp 0.4s ease-out both',
      animationDelay: `${delay}ms`,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}
  >
    <div style={{ width: 4, background: accent, flexShrink: 0 }} />
    <div style={{ background: 'white', flex: 1, padding: '14px 16px' }}>
      <p
        style={{
          fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
          fontSize: 11,
          color: labelColor,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 6,
          fontWeight: 500,
          margin: '0 0 6px',
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: 'DM Serif Display, Georgia, serif',
          fontStyle: 'italic',
          fontSize: 15,
          color: '#2d2420',
          margin: 0,
          lineHeight: 1.55,
        }}
      >
        {text}
      </p>
    </div>
  </div>
);

const PeacePlan: React.FC<PeacePlanProps> = ({ plan, entry, onClose }) => {
  const before = entry.intensity ?? null;
  const after = entry.intensityAfterCalm ?? null;
  const drop = before !== null && after !== null ? before - after : null;

  return (
    <div
      style={{
        background: '#f5f0e8',
        minHeight: '100vh',
        padding: '40px 20px 100px',
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          animation: 'fadeUp 0.5s ease-out 300ms both',
          marginBottom: 28,
        }}
      >
        <p
          style={{
            fontFamily: 'DM Serif Display, Georgia, serif',
            fontStyle: 'italic',
            fontSize: 22,
            color: '#2d2420',
            margin: '0 0 6px',
          }}
        >
          You made it through.
        </p>
        <p
          style={{
            fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
            fontSize: 14,
            color: '#9a8e84',
            margin: 0,
          }}
        >
          Here's what to say next.
        </p>
      </div>

      {/* Loading state */}
      {!plan && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p
            style={{
              fontFamily: 'DM Serif Display, Georgia, serif',
              fontStyle: 'italic',
              fontSize: 20,
              color: '#9a8e84',
              animation: 'fadeIn 0.5s ease-out infinite alternate',
            }}
          >
            ...
          </p>
        </div>
      )}

      {/* Plan cards */}
      {plan && (
        <>
          <Card
            accent="#c4956a"
            labelColor="#c4956a"
            label="Open with"
            text={plan.openWith}
            delay={0}
          />
          <Card
            accent="#1a6880"
            labelColor="#1a6880"
            label="Name what you need"
            text={plan.nameYourNeed}
            delay={120}
          />
          <Card
            accent="#9eb89e"
            labelColor="#5a8a5a"
            label="Offer a step"
            text={plan.offerAStep}
            delay={240}
          />

          {/* Bridge Now card */}
          <div
            style={{
              background: '#ede8e0',
              borderRadius: 12,
              padding: '16px 18px',
              marginBottom: 10,
              animation: 'fadeUp 0.4s ease-out 360ms both',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            <p
              style={{
                fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
                fontSize: 11,
                color: '#9a8e84',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                margin: '0 0 8px',
                fontWeight: 500,
              }}
            >
              Something to say right now
            </p>
            <p
              style={{
                fontFamily: 'DM Serif Display, Georgia, serif',
                fontStyle: 'italic',
                fontSize: 17,
                color: '#2d2420',
                margin: 0,
                lineHeight: 1.55,
              }}
            >
              {plan.bridgeNow}
            </p>
          </div>

          {/* Pattern note */}
          {plan.patternNote && (
            <div
              style={{
                background: 'white',
                borderRadius: 12,
                padding: '12px 16px',
                marginBottom: 10,
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
                animation: 'fadeUp 0.4s ease-out 480ms both',
              }}
            >
              <Info size={14} color="#9a8e84" style={{ marginTop: 2, flexShrink: 0 }} />
              <p
                style={{
                  fontFamily: 'DM Serif Display, Georgia, serif',
                  fontStyle: 'italic',
                  fontSize: 13,
                  color: '#9a8e84',
                  margin: 0,
                  lineHeight: 1.55,
                }}
              >
                {plan.patternNote}
              </p>
            </div>
          )}

          {/* Intensity drop */}
          {before !== null && after !== null && (
            <div
              style={{
                background: 'white',
                borderRadius: 12,
                padding: '16px 20px',
                marginBottom: 10,
                animation: 'fadeUp 0.4s ease-out 500ms both',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              <p
                style={{
                  fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
                  fontSize: 11,
                  color: '#9a8e84',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  margin: '0 0 12px',
                  fontWeight: 500,
                }}
              >
                Your shift
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ textAlign: 'center' }}>
                  <p
                    style={{
                      fontFamily: 'DM Serif Display, Georgia, serif',
                      fontSize: 36,
                      color: '#c4956a',
                      margin: 0,
                      lineHeight: 1,
                    }}
                  >
                    {before}
                  </p>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: '#9a8e84', margin: '4px 0 0' }}>
                    before
                  </p>
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: 'linear-gradient(to right, #c4956a, #9eb89e)',
                    borderRadius: 1,
                  }}
                />
                <div style={{ textAlign: 'center' }}>
                  <p
                    style={{
                      fontFamily: 'DM Serif Display, Georgia, serif',
                      fontSize: 36,
                      color: '#9eb89e',
                      margin: 0,
                      lineHeight: 1,
                    }}
                  >
                    {after}
                  </p>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: '#9a8e84', margin: '4px 0 0' }}>
                    after
                  </p>
                </div>
              </div>
              {drop !== null && drop > 0 && (
                <p
                  style={{
                    fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
                    fontSize: 13,
                    color: '#5a8a5a',
                    margin: '12px 0 0',
                    textAlign: 'center',
                  }}
                >
                  You came down {drop} point{drop !== 1 ? 's' : ''}.
                </p>
              )}
            </div>
          )}
        </>
      )}

      {/* Done button */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 20px 28px',
          background: 'linear-gradient(to top, #f5f0e8 70%, transparent)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            width: '100%',
            maxWidth: 400,
            display: 'block',
            margin: '0 auto',
            background: '#1a6880',
            border: 'none',
            borderRadius: 28,
            padding: '15px 0',
            color: '#e1f5ee',
            fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
            fontSize: 15,
            fontWeight: 500,
            cursor: 'pointer',
            letterSpacing: '0.02em',
          }}
        >
          I'm ready. Let's talk.
        </button>
      </div>
    </div>
  );
};

export default PeacePlan;
