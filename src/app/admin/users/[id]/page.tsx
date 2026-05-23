export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">User Profile</h1>
      <div className="rounded-xl border bg-card p-6">
        <p>
          Viewing profile for user ID: <span className="font-mono bg-muted px-1 rounded">{id}</span>
        </p>
      </div>
    </div>
  );
}
