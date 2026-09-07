import React from 'react';
import { ArrowLeft, Phone, MessageSquare, ShieldAlert } from 'lucide-react';

interface Props {
  onAcknowledge: () => void;
  /** true = shown on demand from the "crisis help" link, so the button reads "Back" not "I understand" */
  asReference?: boolean;
}

/* PROJECT.md promises a safety screen with crisis resources. It existed as a component but was
   never rendered, so the numbers were unreachable. Restyled here in the app's own language
   (warm paper on ocean, DM Serif headings) instead of the orphaned Tailwind utilities it used. */

const RESOURCES = [
  {
    icon: Phone,
    label: 'National Domestic Violence Hotline (US)',
    value: '1-800-799-7233',
    href: 'tel:18007997233',
  },
  {
    icon: MessageSquare,
    label: 'Crisis Text Line',
    value: 'Text HOME to 741741',
    href: 'sms:741741&body=HOME',
  },
  {
    icon: Phone,
    label: 'Emergency services',
    value: '911 (US) · 999 (UK) · 112 (EU)',
    href: 'tel:911',
  },
];

const SafetyScreen: React.FC<Props> = ({ onAcknowledge, asReference = false }) => (
  <div
    style={{
      background: '#0b1825',
      minHeight: '100vh',
      padding: '48px 24px 48px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      animation: 'fadeUp 0.4s ease-out both',
    }}
  >
    <div style={{ width: '100%', maxWidth: 380, margin: '0 auto' }}>
      {asReference && (
        <button
          onClick={onAcknowledge}
          style={{
            background: 'none',
            border: 'none',
            color: '#7fb3c8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
            fontSize: 13,
            padding: 0,
            marginBottom: 28,
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>
      )}

      <ShieldAlert size={30} color="#c4956a" style={{ marginBottom: 16 }} />

      <p
        style={{
          fontFamily: 'DM Serif Display, Georgia, serif',
          fontStyle: 'italic',
          fontSize: 23,
          color: '#c8dce8',
          margin: '0 0 10px',
          lineHeight: 1.35,
        }}
      >
        If you are not safe, this app is the wrong tool.
      </p>
      <p
        style={{
          fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
          fontSize: 13.5,
          color: '#6f9bad',
          margin: '0 0 26px',
          lineHeight: 1.7,
        }}
      >
        Peace Button helps with self-regulation and finding words. It is not therapy, emergency
        services, or legal advice. Reach a human below.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        {RESOURCES.map(r => {
          const Icon = r.icon;
          return (
            <a
              key={r.label}
              href={r.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 13,
                background: 'rgba(26,104,128,0.12)',
                border: '1px solid rgba(26,104,128,0.4)',
                borderRadius: 12,
                padding: '13px 15px',
                textDecoration: 'none',
              }}
            >
              <Icon size={17} color="#7fb3c8" style={{ flexShrink: 0 }} />
              <div>
                <p
                  style={{
                    fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
                    fontSize: 10.5,
                    color: '#4a7a8a',
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                    margin: '0 0 3px',
                    fontWeight: 500,
                  }}
                >
                  {r.label}
                </p>
                <p
                  style={{
                    fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
                    fontSize: 14.5,
                    color: '#e1f5ee',
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  {r.value}
                </p>
              </div>
            </a>
          );
        })}
      </div>

      <button
        onClick={onAcknowledge}
        style={{
          width: '100%',
          background: asReference ? 'rgba(26,104,128,0.25)' : '#1a6880',
          border: asReference ? '1px solid #1a6880' : 'none',
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
        {asReference ? 'Back to Peace Button' : 'I understand — open the app'}
      </button>
    </div>
  </div>
);

export default SafetyScreen;
