'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { SiteNav } from '@/components/landing/site-nav';
import { Hero } from '@/components/landing/hero';
import { ProductPreview } from '@/components/landing/product-preview';
import { FeaturesBento } from '@/components/landing/features-bento';
import { HowItWorks } from '@/components/landing/how-it-works';
import { FinalCta } from '@/components/landing/final-cta';
import { SiteFooter } from '@/components/landing/site-footer';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) router.replace('/dashboard');
  }, [isLoading, user, router]);

  // Already-authenticated visitors get bounced to the dashboard above — avoid
  // flashing marketing content at them while that redirect is in flight.
  if (isLoading || user) return null;

  return (
    <div className="flex flex-1 flex-col">
      <SiteNav />
      <Hero />
      <ProductPreview />
      <FeaturesBento />
      <HowItWorks />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}
