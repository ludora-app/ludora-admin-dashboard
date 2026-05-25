export default function PendingFieldsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Pending Validations</h1>
      <div className="rounded-xl border bg-card p-6 border-orange-200 bg-orange-50/30">
        <p>Queue of terrains awaiting admin approval.</p>
      </div>
    </div>
  );
}
