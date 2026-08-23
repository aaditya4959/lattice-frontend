import { Zap, Users, Palette, ShieldCheck, Smartphone, RefreshCw } from 'lucide-react';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { cn } from '@/lib/utils';

function GradientHeader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex h-full min-h-24 w-full flex-1 rounded-xl bg-gradient-to-br',
        className,
      )}
    />
  );
}

const FEATURES = [
  {
    title: 'Real-time by design',
    description:
      'Every keystroke syncs instantly across everyone viewing the doc, powered by conflict-free CRDT sync — not save buttons or polling.',
    icon: <Zap className="h-4 w-4 text-neutral-500" />,
    header: <GradientHeader className="from-amber-200 to-orange-300 dark:from-amber-900 dark:to-orange-800" />,
    className: 'md:col-span-2',
  },
  {
    title: 'See who’s here',
    description: 'A live roster and colored cursors show exactly who’s viewing and where they’re typing.',
    icon: <Users className="h-4 w-4 text-neutral-500" />,
    header: <GradientHeader className="from-blue-200 to-cyan-300 dark:from-blue-900 dark:to-cyan-800" />,
    className: 'md:col-span-1',
  },
  {
    title: 'Rich formatting',
    description:
      'Headings, colors, lists, blockquotes, and code blocks — with Notion-style shortcuts like typing "# " for a heading.',
    icon: <Palette className="h-4 w-4 text-neutral-500" />,
    header: <GradientHeader className="from-fuchsia-200 to-purple-300 dark:from-fuchsia-900 dark:to-purple-800" />,
    className: 'md:col-span-1',
  },
  {
    title: 'Secure by default',
    description:
      'Every document has a clear owner and collaborator list — invite exactly who you want, remove access just as easily.',
    icon: <ShieldCheck className="h-4 w-4 text-neutral-500" />,
    header: <GradientHeader className="from-emerald-200 to-teal-300 dark:from-emerald-900 dark:to-teal-800" />,
    className: 'md:col-span-1',
  },
  {
    title: 'Never lose your place',
    description:
      'Drop offline mid-sentence? Lattice reconnects and reconciles automatically the moment you’re back.',
    icon: <RefreshCw className="h-4 w-4 text-neutral-500" />,
    header: <GradientHeader className="from-rose-200 to-pink-300 dark:from-rose-900 dark:to-pink-800" />,
    className: 'md:col-span-1',
  },
  {
    title: 'Works everywhere',
    description: 'A fully responsive editor that feels just as natural on your phone as it does on your laptop.',
    icon: <Smartphone className="h-4 w-4 text-neutral-500" />,
    header: <GradientHeader className="from-slate-200 to-zinc-300 dark:from-slate-800 dark:to-zinc-700" />,
    className: 'md:col-span-1',
  },
];

export function FeaturesBento() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Everything a fast-moving team needs</h2>
        <p className="text-muted-foreground mt-3">
          Built from the ground up for writing together, not just writing alone.
        </p>
      </div>

      <BentoGrid className="mt-12">
        {FEATURES.map((feature) => (
          <BentoGridItem
            key={feature.title}
            title={feature.title}
            description={feature.description}
            header={feature.header}
            icon={feature.icon}
            className={feature.className}
          />
        ))}
      </BentoGrid>
    </section>
  );
}
