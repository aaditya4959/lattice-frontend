import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function FinalCta() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24 text-center">
      <div className="border-border bg-card relative overflow-hidden rounded-3xl border px-6 py-16 sm:px-16">
        <div
          aria-hidden
          className="from-primary/10 absolute inset-0 bg-gradient-to-br to-transparent"
        />
        <div className="relative">
          <h2 className="text-3xl font-bold md:text-4xl">Start writing together</h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-md">
            Create your first document in under a minute. It&apos;s free to get started.
          </p>
          <Button size="lg" className="mt-8 px-8" asChild>
            <Link href="/register">Get started free</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
