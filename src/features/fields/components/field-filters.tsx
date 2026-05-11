"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { FieldsFindAllFieldsAdminStatus } from "@/api/generated/model/fieldsFindAllFieldsAdminStatus.api";
import { FieldsFindAllFieldsAdminSportsItem } from "@/api/generated/model/fieldsFindAllFieldsAdminSportsItem.api";
import { useEffect, useState } from "react";

interface FieldFiltersProps {
  onFiltersChange: (filters: {
    search?: string;
    status?: FieldsFindAllFieldsAdminStatus;
    sports?: FieldsFindAllFieldsAdminSportsItem[];
  }) => void;
}

export function FieldFilters({ onFiltersChange }: FieldFiltersProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<FieldsFindAllFieldsAdminStatus | "ALL">("ALL");
  const [sport, setSport] = useState<FieldsFindAllFieldsAdminSportsItem | "ALL">("ALL");

  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({
        search: search || undefined,
        status: status === "ALL" ? undefined : status,
        sports: sport === "ALL" ? undefined : [sport as FieldsFindAllFieldsAdminSportsItem],
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [search, status, sport, onFiltersChange]);

  return (
    <div className="flex flex-col md:flex-row gap-4 items-end bg-card p-6 rounded-card shadow-card mb-8">
      <div className="flex-1 w-full space-y-2">
        <Label
          htmlFor="search"
          className="text-xs font-semibold uppercase tracking-wider text-text-muted"
        >
          Search fields
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            id="search"
            placeholder="Search by name or address..."
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
          Status
        </Label>
        <select
          id="status"
          className="w-full h-10 px-3 rounded-btn border border-border bg-background text-sm shadow-input focus:outline-none focus:ring-2 focus:ring-violet-principal/20"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
        >
          <option value="ALL">All Status</option>
          {Object.values(FieldsFindAllFieldsAdminStatus).map((s) => (
            <option key={s} value={s}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full md:w-48 space-y-2">
        <Label
          htmlFor="sport"
          className="text-xs font-semibold uppercase tracking-wider text-text-muted"
        >
          Sport
        </Label>
        <select
          id="sport"
          className="w-full h-10 px-3 rounded-btn border border-border bg-background text-sm shadow-input focus:outline-none focus:ring-2 focus:ring-violet-principal/20"
          value={sport}
          onChange={(e) => setSport(e.target.value as any)}
        >
          <option value="ALL">All Sports</option>
          {Object.values(FieldsFindAllFieldsAdminSportsItem).map((s) => (
            <option key={s} value={s}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
