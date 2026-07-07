import { Component } from "react";

/**
 * Root error boundary. A render error anywhere below would otherwise unmount the
 * whole React tree and leave a blank white screen. Instead we surface the error
 * (message + stack) so it is diagnosable, and offer a reload — no more silent
 * white-out after a runtime crash.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Keep it in the console for remote debugging, and in state for the UI.
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary] render crash:", error, info);
    this.setState({ info });
  }

  render() {
    if (!this.state.error) return this.props.children;

    const { error, info } = this.state;
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 font-mono p-6 overflow-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-red-400 text-lg font-bold uppercase tracking-widest mb-2">
            Interface error
          </h1>
          <p className="text-slate-400 text-sm mb-4">
            A component crashed. The app did not close — reload to recover. Details below.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mb-4 px-4 py-1.5 rounded border border-red-500 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs uppercase font-bold tracking-wider"
          >
            Reload
          </button>
          <pre className="text-[11px] text-red-300 whitespace-pre-wrap bg-black/40 border border-slate-800 rounded p-3">
            {String(error && (error.stack || error.message || error))}
          </pre>
          {info && info.componentStack ? (
            <pre className="mt-3 text-[10px] text-slate-500 whitespace-pre-wrap bg-black/40 border border-slate-800 rounded p-3">
              {info.componentStack}
            </pre>
          ) : null}
        </div>
      </div>
    );
  }
}
