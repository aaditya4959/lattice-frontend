import { AuthGuard } from '@/components/auth-guard';

export default async function DocEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AuthGuard>
      <main className="flex flex-1 flex-col p-6">
        <p className="text-muted-foreground text-sm">
          Collaborative editor for doc {id} — built in LAT-E10/E11/E12.
        </p>
      </main>
    </AuthGuard>
  );
}
