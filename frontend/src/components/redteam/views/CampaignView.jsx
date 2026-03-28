// View wrapper for CampaignTab in the Command Center layout
import CampaignTab from '../CampaignTab';

export default function CampaignView() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-neutral-100">Formal Campaign</h1>
        <span className="text-xs text-neutral-500 font-mono bg-neutral-800 px-2 py-1 rounded">52 templates</span>
      </div>
      <p className="text-sm text-neutral-400 mb-6">
        Run formal thesis validation campaigns across all 34 backend chains.
        Configurable N trials, Aegis Shield, null control. Live Chain Monitor with per-chain status.
      </p>
      <CampaignTab />
    </div>
  );
}
