// Purely decorative illustration of the editor for the marketing page — not
// the real Quill/Yjs editor. Keeps that heavy dependency off the public,
// logged-out landing page entirely.
export function EditorMockup() {
  return (
    <div className="flex h-full w-full flex-col bg-white text-neutral-900">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2.5 sm:px-6 sm:py-3">
        <div className="flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50 px-2 py-1 sm:gap-1.5 sm:px-3 sm:py-1.5">
          {['B', 'I', 'U'].map((letter) => (
            <span
              key={letter}
              className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-semibold text-neutral-500 sm:h-6 sm:w-6 sm:text-xs"
            >
              {letter}
            </span>
          ))}
          <span className="mx-0.5 h-4 w-px bg-neutral-200" />
          <span className="h-3.5 w-3.5 rounded-full bg-amber-500 sm:h-4 sm:w-4" />
          <span className="h-3.5 w-3.5 rounded-full bg-blue-500 sm:h-4 sm:w-4" />
        </div>
        <div className="flex -space-x-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[9px] font-semibold text-white ring-2 ring-white sm:h-7 sm:w-7 sm:text-[10px]">
            AB
          </span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-semibold text-white ring-2 ring-white sm:h-7 sm:w-7 sm:text-[10px]">
            CD
          </span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-[9px] font-semibold text-white ring-2 ring-white sm:h-7 sm:w-7 sm:text-[10px]">
            EF
          </span>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden px-6 py-6 sm:px-10 sm:py-8">
        <h3 className="text-lg font-bold sm:text-2xl">Q3 launch plan</h3>
        <p className="mt-3 max-w-md text-xs leading-relaxed text-neutral-600 sm:mt-4 sm:text-sm">
          We&apos;re aligning on scope for the{' '}
          <span className="rounded bg-amber-100 px-1 text-amber-900">public beta</span> before
          kicking off engineering. Key workstreams below.
        </p>
        <ul className="mt-3 space-y-1.5 text-xs text-neutral-600 sm:mt-4 sm:space-y-2 sm:text-sm">
          <li className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-neutral-400" /> Finalize onboarding flow
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-neutral-400" /> Draft pricing page copy
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-neutral-400" /> Schedule launch review
          </li>
        </ul>

        <div className="absolute top-[4.2rem] left-[8.5rem] hidden h-5 border-l-2 border-emerald-500 sm:block">
          <span className="absolute -top-5 -left-0.5 rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] whitespace-nowrap text-white">
            Priya
          </span>
        </div>
        <div className="absolute top-[9.6rem] left-[3rem] hidden h-5 border-l-2 border-blue-500 sm:block">
          <span className="absolute -top-5 -left-0.5 rounded bg-blue-500 px-1.5 py-0.5 text-[10px] whitespace-nowrap text-white">
            Sam
          </span>
        </div>
      </div>
    </div>
  );
}
