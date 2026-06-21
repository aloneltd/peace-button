import React, { useState, useEffect } from 'react';

interface SomaticScreenProps {
  onDone: () => void;
}

const SomaticScreen: React.FC<SomaticScreenProps> = ({ onDone }) => {
  const [showSecondLine, setShowSecondLine] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowSecondLine(true), 2000);
    const t2 = setTimeout(() => setShowPulse(true), 4000);
    const t3 = setTimeout(() => setShowContinue(true), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div
      style={{
        background: '#0b1825',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 32px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Skip link — always visible */}
      <button
        onClick={onDone}
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

      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        {/* Small header */}
        <p
          style={{
            fontFamily: 'DM Serif Display, Georgia, serif',
            fontStyle: 'italic',
            fontSize: 14,
            color: '#7fb3c8',
            margin: 0,
            animation: 'fadeUp 0.6s ease-out both',
          }}
        >
          Before anything else
        </p>

        {/* First main line */}
        <p
          style={{
            fontFamily: 'DM Serif Display, Georgia, serif',
            fontStyle: 'italic',
            fontSize: 26,
            color: '#c8dce8',
            margin: 0,
            lineHeight: 1.4,
            animation: 'fadeUp 0.6s ease-out 0.3s both',
          }}
        >
          Put your hand on your chest.
        </p>

        {/* Second line — fades in after 2s */}
        <p
          style={{
            fontFamily: 'DM Serif Display, Georgia, serif',
            fontStyle: 'italic',
            fontSize: 24,
            color: '#7fb3c8',
            margin: 0,
            lineHeight: 1.4,
            opacity: showSecondLine ? 1 : 0,
            transform: showSecondLine ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          }}
        >
          Feel it.
        </p>

        {/* Pulse ring — appears after 4s */}
        <div
          style={{
            position: 'relative',
            width: 80,
            height: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 12,
            opacity: showPulse ? 1 : 0,
            transition: 'opacity 0.6s ease-out',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: 80,
              height: 80,
              borderRadius: '50%',
              border: '1.5px solid #7fb3c8',
              animation: showPulse ? 'ringPulse 2s ease-in-out infinite' : 'none',
            }}
          />
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: '#1a6880',
              opacity: 0.7,
            }}
          />
        </div>

        {/* Continue button — appears after 5s */}
        <div
          style={{
            marginTop: 20,
            opacity: showContinue ? 1 : 0,
            transform: showContinue ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
            pointerEvents: showContinue ? 'auto' : 'none',
          }}
        >
          <button
            onClick={onDone}
            style={{
              background: '#1a6880',
              border: 'none',
              borderRadius: 24,
              padding: '13px 36px',
              color: '#e1f5ee',
              fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
              fontSize: 15,
              fontWeight: 500,
              cursor: 'pointer',
              letterSpacing: '0.02em',
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SomaticScreen;
