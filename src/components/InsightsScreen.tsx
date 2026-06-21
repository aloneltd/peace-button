import React from 'react';
import { ArrowLeft } from 'lucide-react';
import type { TriggerEntry } from '../types';

interface InsightsScreenProps {
  entries: TriggerEntry[];
  onBack: () => void;
}

const InsightsScreen: React.FC<InsightsScreenProps> = ({ entries, onBack }) => {
  const recent = entries.slice(0, 10);
  const count = entries.length;

  const avgBefore = count > 0
    ? entries.reduce((sum, e) => sum + e.intensity, 0) / count
    : 0;

  const calmedEntries = entries.filter(e => e.intensityAfterCalm !== undefined);
  const avgAfter = calmedEntries.length > 0
    ? calmedEntries.reduce((sum, e) => sum + (e.intensityAfterCalm ?? 0), 0) / calmedEntries.length
    : 0;

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div
      style={{
        background: '#f5f0e8',
        minHeight: '100vh',
        padding: '0 0 40px',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: '#0b1825',
          padding: '20px 20px 28px',
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#7fb3c8',
            cursor: 'pointer',
            padding: '4px 0',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <p
          style={{
            fontFamily: 'DM Serif Display, Georgia, serif',
            fontSize: 26,
            color: '#c8dce8',
            margin: 0,
            fontWeight: 400,
          }}
        >
          Your patterns
        </p>
      </div>

      <div style={{ padding: '24px 20px' }}>
        {count === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p
              style={{
                fontFamily: 'DM Serif Display, Georgia, serif',
                fontStyle: 'italic',
                fontSize: 18,
                color: '#9a8e84',
              }}
            >
              No entries yet.
            </p>
            <p
              style={{
                fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
                fontSize: 14,
                color: '#9a8e84',
                marginTop: 8,
              }}
            >
              Come back after your first session.
            </p>
          </div>
        )}

        {/* Pattern card — 5+ entries */}
        {count >= 5 && (
          <div
            style={{
              background: '#ede8e0',
              borderRadius: 16,
              padding: '20px 20px',
              marginBottom: 20,
            }}
          >
            <p
              style={{
                fontFamily: 'DM Serif Display, Georgia, serif',
                fontStyle: 'italic',
                fontSize: 16,
                color: '#2d2420',
                margin: '0 0 12px',
              }}
            >
              The last {count} times you came here...
            </p>
            <p
              style={{
                fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
                fontSize: 14,
                color: '#2d2420',
                margin: '0 0 8px',
                lineHeight: 1.6,
              }}
            >
              Your average intensity coming in:{' '}
              <strong style={{ color: '#c4956a' }}>{avgBefore.toFixed(1)}</strong>.
              {calmedEntries.length > 0 && (
                <> You leave at{' '}
                  <strong style={{ color: '#5a8a5a' }}>{avgAfter.toFixed(1)}</strong>.
                  {' '}You're doing the work.
                </>
              )}
            </p>
            {count >= 10 && (
              <p
                style={{
                  fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
                  fontSize: 13,
                  color: '#9a8e84',
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                You've used Peace Button {count} times. That's {count} moments you chose to pause.
              </p>
            )}
          </div>
        )}

        {/* Recent sessions */}
        {count > 0 && (
          <>
            <p
              style={{
                fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
                fontSize: 12,
                color: '#9a8e84',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                margin: '0 0 12px',
                fontWeight: 500,
              }}
            >
              Recent sessions
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recent.map(entry => (
                <div
                  key={entry.id}
                  style={{
                    background: 'white',
                    borderRadius: 12,
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
                      fontSize: 13,
                      color: '#9a8e84',
                      margin: 0,
                    }}
                  >
                    {formatDate(entry.timestamp)}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        fontFamily: 'DM Serif Display, Georgia, serif',
                        fontSize: 20,
                        color: '#c4956a',
                      }}
                    >
                      {entry.intensity}
                    </span>
                    {entry.intensityAfterCalm !== undefined && (
                      <>
                        <span
                          style={{
                            fontFamily: 'Plus Jakarta Sans',
                            fontSize: 12,
                            color: '#9a8e84',
                          }}
                        >
                          →
                        </span>
                        <span
                          style={{
                            fontFamily: 'DM Serif Display, Georgia, serif',
                            fontSize: 20,
                            color: '#9eb89e',
                          }}
                        >
                          {entry.intensityAfterCalm}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InsightsScreen;
