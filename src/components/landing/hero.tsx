import Link from 'next/link';
import { Spotlight } from '@/components/ui/spotlight-new';
import { FlipWords } from '@/components/ui/flip-words';
import { Button } from '@/components/ui/button';

const FLIP_WORDS = ['alive', 'instant', 'together', 'effortless'];

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden bg-background"
    >
      <Spotlight />

      <div
        aria-hidden
        className="absolute inset-0 [background-size:40px_40px] [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_60%,transparent_100%)]"
      />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 py-32 text-center">
        <h1 className="text-4xl leading-tight font-bold tracking-tight md:text-6xl">
          Docs that feel
          <br />
          <FlipWords words={FLIP_WORDS} className="text-primary font-bold" />
        </h1>
        <p className="text-muted-foreground mt-6 max-w-xl text-base md:text-lg">
          Lattice is a real-time collaborative editor. Watch teammates&apos; cursors move as they
          type, write together without version conflicts, and never lose a keystroke.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Button size="lg" className="px-8" asChild>
            <Link href="/register">Get started free</Link>
          </Button>
          <Button size="lg" variant="outline" className="px-8" asChild>
            <Link href="/login">Log in</Link>
          </Button>
        </div>
        <p className="text-muted-foreground mt-4 text-xs">No credit card required.</p>
      </div>
    </section>
  );
}

// Dummy commit 
