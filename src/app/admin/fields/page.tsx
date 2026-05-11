import { FieldsManagement } from "@/features/fields";

export default function FieldsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
          Terrain Management
        </h1>
        <p className="text-text-secondary">
          Browse and manage all sports fields registered on Ludora.
        </p>
      </div>

      <FieldsManagement />
    </div>
  );
}
