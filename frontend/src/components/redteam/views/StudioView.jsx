// View wrapper for AdversarialStudio in the Command Center layout
import AdversarialStudio from '../AdversarialStudio';

export default function StudioView() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-neutral-100">Adversarial Studio</h1>
      </div>
      <p className="text-sm text-neutral-400 mb-6">
        Craft and refine adversarial prompts with real-time preview. Edit system prompts,
        test injection vectors, and analyze model responses interactively.
      </p>
      <AdversarialStudio />
    </div>
  );
}
