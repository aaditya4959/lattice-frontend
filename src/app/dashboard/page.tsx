import { AuthGuard } from '@/components/auth-guard';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <main className="flex flex-1 flex-col p-6">
        <p className="text-muted-foreground text-sm">
          Document dashboard — built in LAT-E9.
        </p>
      </main>
    </AuthGuard>
  );
}
