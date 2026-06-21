import React, { useState } from 'react';

interface IntakeFormProps {
  onDone: (description?: string) => void;
}

const IntakeForm: React.FC<IntakeFormProps> = ({ onDone }) => {
  const [description, setDescription] = useState('');

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
          onClick={() => onDone(description.trim() || undefined)}
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
          onClick={() => onDone(undefined)}
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
