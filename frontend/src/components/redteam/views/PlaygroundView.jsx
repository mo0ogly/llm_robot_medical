// View wrapper for PlaygroundTab in the Command Center layout
import PlaygroundTab from '../PlaygroundTab';

export default function PlaygroundView() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-neutral-100">Injection Playground</h1>
      </div>
      <p className="text-sm text-neutral-400 mb-6">
        Manual injection testing environment. Edit system prompts, craft custom payloads,
        toggle Aegis Shield, and observe model responses in real-time.
      </p>
      <PlaygroundTab />
    </div>
  );
}
