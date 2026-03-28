// View wrapper for CatalogTab in the Command Center layout
import CatalogTab from '../CatalogTab';

export default function CatalogView() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-neutral-100">Attack Catalog</h1>
        <span className="text-xs text-neutral-500 font-mono bg-neutral-800 px-2 py-1 rounded">52 templates</span>
      </div>
      <p className="text-sm text-neutral-400 mb-6">
        Browse, select, and launch individual attack templates against the surgical assistant.
        Each template has configurable variables and a detailed help modal.
      </p>
      <CatalogTab />
    </div>
  );
}
