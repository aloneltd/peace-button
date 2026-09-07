import React, { useRef, useState } from 'react';

interface IntakeFormProps {
  onDone: (description?: string) => void;
}

const IntakeForm: React.FC<IntakeFormProps> = ({ onDone }) => {
  const [description, setDescription] = useState('');
  // REDTEAM: a fast double-tap/mash on "Get my plan" (or the skip link right after it) fired
  // onDone — and therefore the AI call in the parent — more than once per session. Harmless to
  // data, but it burned extra AI quota and could race two plans into the same view. A submitted
  // ref (not state, so it can't be bypassed by a click that lands before a re-render) makes both
  // buttons a one-shot.
  const submitted = useRef(false);
  const submitOnce = (value?: string) => {
    if (submitted.current) return;
    submitted.current = true;
    onDone(value);
  };

  return (
    <div
      style={{
        background: '#0d2233',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 28px',
        animation: 'fadeUp 0.5s ease-out both',
      }}
    >
      <div style={{ width: '100%', maxWidth: 360 }}>
        <p
          style={{
            fontFamily: 'DM Serif Display, Georgia, serif',
            fontStyle: 'italic',
            fontSize: 22,
            color: '#c8dce8',
            margin: '0 0 32px',
            lineHeight: 1.4,
          }}
        >
          While you're here...
        </p>

        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="What sparked this? (optional)"
          rows={3}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid #1a6880',
            color: '#c8dce8',
            fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
            fontSize: 15,
            padding: '8px 0',
            resize: 'none',
            outline: 'none',
            marginBottom: 32,
            lineHeight: 1.6,
          }}
        />

        <button
          onClick={() => submitOnce(description.trim() || undefined)}
          style={{
            width: '100%',
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
            marginBottom: 16,
            transition: 'opacity 0.15s',
          }}
        >
          Get my plan →
        </button>

        <button
          onClick={() => submitOnce(undefined)}
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            color: '#4a7a8a',
            fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
            fontSize: 13,
            cursor: 'pointer',
            padding: '8px 0',
          }}
        >
          Skip, just give me the plan
        </button>
      </div>
    </div>
  );
};

export default IntakeForm;
