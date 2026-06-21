import React, { useState } from 'react';
import { ArrowLeft, Shield, Trash2 } from 'lucide-react';
import type { UserPrefs } from '../types';

interface SettingsScreenProps {
  prefs: UserPrefs;
  setPrefs: (prefs: UserPrefs) => void;
  onBack: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ prefs, setPrefs, onBack }) => {
  const [newPasscode, setNewPasscode] = useState('');
  const [showPasscodeInput, setShowPasscodeInput] = useState(false);

  const handleTogglePrivacy = () => {
    if (prefs.privacyEnabled) {
      setPrefs({ ...prefs, privacyEnabled: false, passcode: null });
      setShowPasscodeInput(false);
    } else {
      setShowPasscodeInput(true);
    }
  };

  const handleSetPasscode = () => {
    if (newPasscode.length >= 4) {
      setPrefs({ ...prefs, privacyEnabled: true, passcode: newPasscode });
      setNewPasscode('');
      setShowPasscodeInput(false);
    }
  };

  const handleClearData = () => {
    if (window.confirm('Clear all session history? This cannot be undone.')) {
      localStorage.removeItem('pb2_entries');
      window.location.reload();
    }
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 0',
    borderBottom: '1px solid #f0ebe2',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
    fontSize: 15,
    color: '#2d2420',
  };

  const sublabelStyle: React.CSSProperties = {
    fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
    fontSize: 12,
    color: '#9a8e84',
    marginTop: 3,
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
      <div style={{ background: '#0b1825', padding: '20px 20px 28px' }}>
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
          Settings
        </p>
      </div>

      <div style={{ padding: '8px 20px' }}>
        {/* Privacy section */}
        <div
          style={{
            background: 'white',
            borderRadius: 16,
            padding: '4px 16px',
            marginTop: 20,
            marginBottom: 16,
          }}
        >
          <div style={rowStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Shield size={18} color="#1a6880" />
              <div>
                <p style={labelStyle}>Private mode</p>
                <p style={sublabelStyle}>Require passcode to open</p>
              </div>
            </div>
            <button
              onClick={handleTogglePrivacy}
              style={{
                width: 44,
                height: 26,
                borderRadius: 13,
                background: prefs.privacyEnabled ? '#1a6880' : '#d1c9bf',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'white',
                  position: 'absolute',
                  top: 3,
                  left: prefs.privacyEnabled ? 21 : 3,
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
            </button>
          </div>

          {showPasscodeInput && (
            <div style={{ padding: '12px 0 16px' }}>
              <p style={{ ...sublabelStyle, marginBottom: 8 }}>Set a 4-digit passcode</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={newPasscode}
                  onChange={e => setNewPasscode(e.target.value)}
                  placeholder="····"
                  style={{
                    flex: 1,
                    background: '#f5f0e8',
                    border: '1px solid #1a6880',
                    borderRadius: 8,
                    padding: '10px 14px',
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: 18,
                    letterSpacing: '0.3em',
                    textAlign: 'center',
                    color: '#2d2420',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={handleSetPasscode}
                  disabled={newPasscode.length < 4}
                  style={{
                    background: newPasscode.length >= 4 ? '#1a6880' : '#d1c9bf',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 16px',
                    color: 'white',
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: newPasscode.length >= 4 ? 'pointer' : 'default',
                    transition: 'background 0.15s',
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Data section */}
        <div
          style={{
            background: 'white',
            borderRadius: 16,
            padding: '4px 16px',
          }}
        >
          <button
            onClick={handleClearData}
            style={{
              ...rowStyle,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              borderBottom: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Trash2 size={18} color="#c4956a" />
              <div>
                <p style={{ ...labelStyle, color: '#c4956a' }}>Clear session history</p>
                <p style={sublabelStyle}>Permanently delete all entries</p>
              </div>
            </div>
          </button>
        </div>

        {/* About */}
        <p
          style={{
            fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
            fontSize: 12,
            color: '#9a8e84',
            textAlign: 'center',
            marginTop: 32,
            lineHeight: 1.6,
          }}
        >
          Peace Button · All data stays on your device.{'\n'}
          No accounts. No servers. No tracking.
        </p>
      </div>
    </div>
  );
};

export default SettingsScreen;
