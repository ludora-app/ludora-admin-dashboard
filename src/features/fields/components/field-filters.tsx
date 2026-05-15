"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FieldsFindAllFieldsAdminSportsItem } from "@/api/generated/model/fieldsFindAllFieldsAdminSportsItem.api";
import { FieldsFindAllFieldsAdminStatus } from "@/api/generated/model/fieldsFindAllFieldsAdminStatus.api";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldFiltersProps {
  onFiltersChange: (filters: {
    search?: string;
    status?: FieldsFindAllFieldsAdminStatus;
    sports?: FieldsFindAllFieldsAdminSportsItem[];
  }) => void;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  APPROVED: "Vérifié",
  REJECTED: "Rejeté",
};

export function FieldFilters({ onFiltersChange }: FieldFiltersProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<FieldsFindAllFieldsAdminStatus | undefined>(
    FieldsFindAllFieldsAdminStatus.PENDING,
  );
  const [selectedSports, setSelectedSports] = useState<FieldsFindAllFieldsAdminSportsItem[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({
        search: search || undefined,
        status: status,
        sports: selectedSports.length > 0 ? selectedSports : undefined,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [search, status, selectedSports, onFiltersChange]);

  const toggleSport = (sport: FieldsFindAllFieldsAdminSportsItem) => {
    setSelectedSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport],
    );
  };

  const clearSports = () => setSelectedSports([]);

  return (
    <div className="flex flex-col gap-6 bg-card p-6 rounded-card shadow-card mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full space-y-2">
          <Label
            htmlFor="search"
            className="text-xs font-semibold uppercase tracking-wider text-text-muted"
          >
            Rechercher des terrains
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              id="search"
              placeholder="Rechercher par nom ou adresse..."
              className="pl-10 shadow-input border-border focus:shadow-input-focus"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full md:w-48 space-y-2">
          <Label
            htmlFor="status"
            className="text-xs font-semibold uppercase tracking-wider text-text-muted"
          >
            Statut
          </Label>
          <select
            id="status"
            className="w-full h-10 px-3 rounded-btn border border-border bg-background text-sm shadow-input focus:outline-none focus:ring-2 focus:ring-violet-principal/20"
            value={status || "ALL"}
            onChange={(e) =>
              setStatus(
                e.target.value === "ALL"
                  ? undefined
                  : (e.target.value as FieldsFindAllFieldsAdminStatus),
              )
            }
          >
            <option value="ALL">Tous les statuts</option>
            {Object.values(FieldsFindAllFieldsAdminStatus).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s] || s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Filtrer par Sports
          </Label>
          {selectedSports.length > 0 && (
            <button
              type="button"
              onClick={clearSports}
              className="text-[10px] font-bold text-violet-principal hover:underline flex items-center gap-1"
            >
              <X className="h-2.5 w-2.5" />
              Tout effacer
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.values(FieldsFindAllFieldsAdminSportsItem).map((s) => {
            const isSelected = selectedSports.includes(s);
            return (
              <Badge
                key={s}
                variant={isSelected ? (s as any) : "secondary"}
                className={cn(
                  "cursor-pointer transition-all hover:scale-105 py-1 px-3 select-none",
                  !isSelected &&
                    "bg-background border-border text-text-secondary hover:bg-secondary/50",
                  isSelected && "shadow-md",
                )}
                onClick={() => toggleSport(s)}
              >
                {s.toLowerCase()}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}
