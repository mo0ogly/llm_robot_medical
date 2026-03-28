// View wrapper for HistoryTab in the Command Center layout
import HistoryTab from '../HistoryTab';

export default function HistoryView() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-neutral-100">Campaign History</h1>
      </div>
      <p className="text-sm text-neutral-400 mb-6">
        Browse past campaign results, scenario executions, and export historical data.
        All results are saved in localStorage for session persistence.
      </p>
      <HistoryTab />
    </div>
  );
}
