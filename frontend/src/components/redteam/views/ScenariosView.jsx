// View wrapper for ScenarioTab in the Command Center layout
import ScenarioTab from '../ScenarioTab';

export default function ScenariosView() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-neutral-100">Kill-Chain Scenarios</h1>
        <span className="text-xs text-neutral-500 font-mono bg-neutral-800 px-2 py-1 rounded">18 scenarios</span>
      </div>
      <p className="text-sm text-neutral-400 mb-6">
        Multi-step attack scenarios chaining 3-5 backend attack chains into realistic kill chains.
        Each scenario targets a specific clinical context with MITRE ATT&CK mapping.
      </p>
      <ScenarioTab />
    </div>
  );
}
