export default function UserDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">User Profile</h1>
      <div className="rounded-xl border bg-card p-6">
        <p>Viewing profile for user ID: <span className="font-mono bg-muted px-1 rounded">{params.id}</span></p>
      </div>
    </div>
  )
}
