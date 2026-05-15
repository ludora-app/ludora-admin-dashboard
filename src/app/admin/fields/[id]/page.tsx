"use client";

import { AlertCircle, ChevronLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useFieldsFindOneForAdmin } from "@/api/generated/api/fields/fields.api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FieldDetailsForm } from "@/features/fields/components/field-details-form";
import { FieldImagesCarousel } from "@/features/fields/components/field-images-carousel";
import { FieldInfoSection } from "@/features/fields/components/field-info-section";
import { FieldSportsSection } from "@/features/fields/components/field-sports-section";

export default function FieldEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  const { data, isLoading, isError, error, refetch } = useFieldsFindOneForAdmin(id);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24 rounded-btn" />
          <Skeleton className="h-8 w-48" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <Skeleton className="aspect-video w-full rounded-card" />
            <Skeleton className="h-[400px] w-full rounded-card" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-card" />
            <Skeleton className="h-48 w-full rounded-card" />
            <Skeleton className="h-32 w-full rounded-card" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    const errorMessage =
      error && typeof error === "object" && "message" in error
        ? (error.message as string)
        : "Une erreur inattendue est survenue lors de la récupération des détails.";

    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-destructive/5 rounded-card border border-destructive/10">
        <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-6">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-text-primary mb-2">Impossible de charger le terrain</h3>
        <p className="text-text-secondary mb-8 max-w-md">{errorMessage}</p>
        <div className="flex gap-4">
          <Link href="/admin/fields">
            <Button variant="outline" className="btn-secondary">
              Retour à la liste
            </Button>
          </Link>
          <Button onClick={() => refetch()} className="btn-primary gap-2">
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }


  const fieldData = data && data.status === 200 ? data.data.data : null;

  if (!fieldData) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/fields">
            <Button
              variant="ghost"
              size="sm"
              className="h-10 gap-2 hover:bg-violet-principal/10 text-violet-principal font-bold"
            >
              <ChevronLeft className="h-4 w-4" />
              Retour
            </Button>
          </Link>
          <div className="h-8 w-[1.5px] bg-secondary hidden md:block" />
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
            {fieldData.name || "Détails du terrain"}
          </h1>
        </div>
        <p className="text-xs font-mono text-text-muted bg-surface-secondary px-3 py-1.5 rounded-lg self-start md:self-center">
          ID: {id}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="xl:col-span-2 space-y-8">
          <FieldImagesCarousel images={fieldData.fieldImages} />
          <FieldDetailsForm field={fieldData} />
        </div>

        {/* Sidebar Area */}
        <div className="space-y-6">
          <FieldInfoSection field={fieldData} />
          <FieldSportsSection field={fieldData} />
        </div>
      </div>
    </div>
  );
}
