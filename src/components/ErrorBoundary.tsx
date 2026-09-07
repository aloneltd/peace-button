import React from 'react';
import { Heart } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

/* REDTEAM: this is a mental-wellbeing app used mid-conflict — an uncaught render error must
   never leave the user staring at a blank white screen or a raw React stack trace. There was
   no error boundary anywhere in the tree, so any unexpected exception (a malformed localStorage
   entry, a bad AI field, anything) would unmount the whole app with nothing on screen.
   This boundary catches it, offers one calm way back to the heart, and never loses session
   history (localStorage is untouched — only in-memory view state resets). */
class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    // Non-secret diagnostics only — never surfaced to the user.
    console.error('Peace Button crashed:', error, info.componentStack);
  }

  handleRestart = () => {
    this.setState({ hasError: false });
    // A full reload is the safest way back to a known-good 'home' state — entries in
    // localStorage survive, only unsaved in-progress state (never written to storage) is lost.
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          background: '#0b1825',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 28px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: '#1a6880',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 22,
            boxShadow: '0 0 24px rgba(26,104,128,0.45)',
          }}
        >
          <Heart size={24} color="#e1f5ee" fill="#e1f5ee" />
        </div>
        <p
          style={{
            fontFamily: 'DM Serif Display, Georgia, serif',
            fontStyle: 'italic',
            fontSize: 20,
            color: '#c8dce8',
            margin: '0 0 10px',
            maxWidth: 320,
            lineHeight: 1.5,
          }}
        >
          Something didn't load right on our end.
        </p>
        <p
          style={{
            fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
            fontSize: 14,
            color: '#6f9bad',
            margin: '0 0 28px',
            maxWidth: 320,
            lineHeight: 1.6,
          }}
        >
          Your saved history is safe. Let's start fresh.
        </p>
        <button
          onClick={this.handleRestart}
          style={{
            background: '#1a6880',
            border: 'none',
            borderRadius: 28,
            padding: '14px 32px',
            color: '#e1f5ee',
            fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
            fontSize: 15,
            fontWeight: 500,
            cursor: 'pointer',
            letterSpacing: '0.02em',
          }}
        >
          Back to Peace Button
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
