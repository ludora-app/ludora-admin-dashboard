import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FieldsManagement } from "@/features/fields";

export default function FieldsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
            Gestion des Terrains
          </h1>
          <p className="text-text-secondary">
            Parcourez et gérez tous les terrains de sport enregistrés sur Ludora.
          </p>
        </div>
        <Link href="/admin/fields/create">
          <Button className="btn-primary gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Ajouter un terrain</span>
            <span className="sm:hidden">Ajouter</span>
          </Button>
        </Link>
      </div>

      <FieldsManagement />
    </div>
  );
}
