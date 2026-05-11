"use client";

import { useState } from "react";
import { FieldFilters } from "./components/field-filters";
import { FieldsList } from "./components/fields-list";
import type { FieldsFindAllFieldsAdminStatus } from "@/api/generated/model/fieldsFindAllFieldsAdminStatus.api";
import type { FieldsFindAllFieldsAdminSportsItem } from "@/api/generated/model/fieldsFindAllFieldsAdminSportsItem.api";

export function FieldsManagement() {
  const [filters, setFilters] = useState<{
    search?: string;
    status?: FieldsFindAllFieldsAdminStatus;
    sports?: FieldsFindAllFieldsAdminSportsItem[];
  }>({});

  return (
    <div className="space-y-6">
      <FieldFilters onFiltersChange={setFilters} />
      <FieldsList filters={filters} />
    </div>
  );
}
