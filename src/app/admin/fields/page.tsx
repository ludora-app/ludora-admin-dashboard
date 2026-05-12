import { FieldsManagement } from "@/features/fields";

export default function FieldsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
          Gestion des Terrains
        </h1>
        <p className="text-text-secondary">
          Parcourez et gérez tous les terrains de sport enregistrés sur Ludora.
        </p>
      </div>

      <FieldsManagement />
    </div>
  );
}
