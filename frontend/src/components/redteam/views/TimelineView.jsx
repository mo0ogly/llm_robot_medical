// View wrapper for GlobalTimeline in the Command Center layout
import GlobalTimeline from '../GlobalTimeline';

export default function TimelineView() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-neutral-100">Global Timeline</h1>
      </div>
      <p className="text-sm text-neutral-400 mb-6">
        Chronological event log of all red team activities: attacks, defenses, violations,
        and system responses with timestamps.
      </p>
      <GlobalTimeline />
    </div>
  );
}
