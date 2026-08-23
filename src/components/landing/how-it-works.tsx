import { StickyScroll } from '@/components/ui/sticky-scroll-reveal';
import { FilePlus2, UserPlus, PenLine } from 'lucide-react';

function StepVisual({
  icon,
  className,
}: {
  icon: React.ReactNode;
  className: string;
}) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${className}`}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
        {icon}
      </div>
    </div>
  );
}

const STEPS = [
  {
    title: 'Create a document',
    description:
      'Start from a blank page in seconds — no templates to configure, no setup. Just give it a title and start writing.',
    content: (
      <StepVisual
        icon={<FilePlus2 className="h-8 w-8 text-white" />}
        className="from-cyan-500 to-emerald-500"
      />
    ),
  },
  {
    title: 'Invite your team',
    description:
      'Add collaborators by email straight from the document. They get access instantly — no separate workspace setup required.',
    content: (
      <StepVisual
        icon={<UserPlus className="h-8 w-8 text-white" />}
        className="from-pink-500 to-indigo-500"
      />
    ),
  },
  {
    title: 'Write together, live',
    description:
      'Watch cursors move, formatting apply, and paragraphs grow in real time. Everyone sees the same document, always in sync.',
    content: (
      <StepVisual
        icon={<PenLine className="h-8 w-8 text-white" />}
        className="from-orange-500 to-yellow-500"
      />
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold md:text-4xl">From blank page to live doc</h2>
        <p className="text-muted-foreground mt-3">Three steps. No onboarding call required.</p>
      </div>

      <div className="mt-12">
        <StickyScroll content={STEPS} />
      </div>
    </section>
  );
}
