import React from 'react';

type State = { error?: Error; info?: React.ErrorInfo };

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  state: State = {};

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // could add telemetry here
    this.setState({ error, info });
    // also log to console
    // eslint-disable-next-line no-console
    console.error('Captured error in ErrorBoundary', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="p-6">
          <h2 className="text-xl font-semibold text-red-600">An error occurred</h2>
          <div className="mt-4 text-sm text-gray-700">
            <div><strong>Error:</strong> {String(this.state.error?.message)}</div>
            {this.state.info && (
              <details className="mt-3 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                <summary className="cursor-pointer">Stack trace / component stack</summary>
                <pre className="text-xs mt-2">{this.state.info.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children ?? null;
  }
}

export default ErrorBoundary;
