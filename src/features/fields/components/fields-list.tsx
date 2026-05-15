"use client";

import { AlertCircle, Inbox } from "lucide-react";
import { useFieldsFindAllFieldsAdmin } from "@/api/generated/api/fields/fields.api";
import type { FieldsFindAllFieldsAdminSportsItem } from "@/api/generated/model/fieldsFindAllFieldsAdminSportsItem.api";
import type { FieldsFindAllFieldsAdminStatus } from "@/api/generated/model/fieldsFindAllFieldsAdminStatus.api";
import { Skeleton } from "@/components/ui/skeleton";
import { FieldCard } from "./field-card";

interface FieldsListProps {
  filters: {
    search?: string;
    status?: FieldsFindAllFieldsAdminStatus;
    sports?: FieldsFindAllFieldsAdminSportsItem[];
  };
}

export function FieldsList({ filters }: FieldsListProps) {
  const { data, isLoading, isError, error } = useFieldsFindAllFieldsAdmin({
    ...filters,
    limit: 50,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`skeleton-${i}`} className="space-y-3">
            <Skeleton className="aspect-video w-full rounded-card" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    const errorMessage =
      error && typeof error === "object" && "message" in error
        ? (error.message as string)
        : "Une erreur inattendue est survenue";

    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-error/10 rounded-card border border-error/20">
        <AlertCircle className="h-10 w-10 text-destructive mb-4" />
        <h3 className="text-lg font-bold text-destructive">Échec du chargement des terrains</h3>
        <p className="text-text-secondary">{errorMessage}</p>
      </div>
    );
  }

  const fields = data?.data?.data?.items || [];

  if (fields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-card shadow-card">
        <Inbox className="h-10 w-10 text-text-muted mb-4" />
        <h3 className="text-lg font-bold text-text-primary">Aucun terrain trouvé</h3>
        <p className="text-text-secondary">Essayez d'ajuster vos filtres ou votre recherche.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {fields.map((field) => (
        <FieldCard key={field.uid} field={field} />
      ))}
    </div>
  );
}
