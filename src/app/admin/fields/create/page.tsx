"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import type { CreatePublicFieldFormDtoSportsItem } from "@/api/generated/model/createPublicFieldFormDtoSportsItem.api";
import { Button } from "@/components/ui/button";
import { FieldCreateForm } from "@/features/fields/components/field-create-form";
import { FieldSportsSection } from "@/features/fields/components/field-sports-section";

export default function FieldCreatePage() {
  const [selectedSports, setSelectedSports] = React.useState<CreatePublicFieldFormDtoSportsItem[]>(
    [],
  );

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
            Ajouter un terrain
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="xl:col-span-2 space-y-8">
          <FieldCreateForm selectedSports={selectedSports} />
        </div>

        {/* Sidebar Area */}
        <div className="space-y-6">
          <FieldSportsSection
            selectedSports={selectedSports as any}
            onSportsChange={setSelectedSports as any}
          />

          <div className="p-6 rounded-card bg-violet-principal/5 border border-violet-principal/10 space-y-3">
            <h3 className="text-sm font-bold text-violet-principal flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-principal text-[10px] text-white">
                i
              </span>
              Note d'administration
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Lors de la création, le terrain sera automatiquement enregistré avec le statut
              <strong> "En attente"</strong> par défaut. Vous pourrez modifier son statut une fois
              le terrain créé.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
