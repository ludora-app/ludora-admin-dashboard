export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50 p-4">Users Stats</div>
        <div className="aspect-video rounded-xl bg-muted/50 p-4">Sessions Stats</div>
        <div className="aspect-video rounded-xl bg-muted/50 p-4">Terrains Stats</div>
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
        Detailed Activity Graph Placeholder
      </div>
    </div>
  );
}
