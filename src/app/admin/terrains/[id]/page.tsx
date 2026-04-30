export default function TerrainEditorPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Edit Terrain</h1>
      <div className="rounded-xl border bg-card p-6">
        <p>
          Editing terrain ID: <span className="font-mono bg-muted px-1 rounded">{params.id}</span>
        </p>
      </div>
    </div>
  );
}
