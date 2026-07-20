// src/components/common/ErrorBoundary.jsx
//
// Catches uncaught JS errors anywhere in the component tree below it and
// shows a friendly fallback UI instead of a blank white page.
//
// Usage (in App.jsx, wrapping the whole app):
//   <ErrorBoundary>
//     <AppRoutes />
//   </ErrorBoundary>

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to console for now — swap this for a real error-tracking
    // service (e.g. Sentry) when one is set up.
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem',
            background: '#ffffff',
          }}
        >
          <img
            src="/assets/logo.webp"
            alt="Resilda's Boutique"
            style={{ width: 70, height: 70, marginBottom: 24, opacity: 0.85 }}
          />
          <h2 style={{ marginBottom: 8, fontFamily: 'inherit' }}>
            Something went wrong
          </h2>
          <p style={{ color: '#666', marginBottom: 24, maxWidth: 420 }}>
            We hit an unexpected error. Please try reloading the page — if the
            problem continues, contact us and we'll help sort it out.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: '0.75rem 2rem',
              background: '#c2903a',
              color: '#000',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Back to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;