export default function StepIndicator({ steps, current }) {
  return (
    <nav className="flex items-center gap-2">
      {steps.map((label, i) => {
        const isActive = i === current;
        const isDone = i < current;
        return (
          <div key={i} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ' + (isActive ? "bg-medical-600 text-white" : "") + ' ' + (isDone ? "bg-medical-100 text-medical-700" : "") + ' ' + (!isActive && !isDone ? "bg-gray-100 text-gray-400" : "")}
              >
                {isDone ? (
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={'text-sm hidden sm:inline ' + (isActive ? "font-medium text-gray-900" : "text-gray-400")}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={'w-8 h-px ' + (isDone ? "bg-medical-300" : "bg-gray-200")}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
