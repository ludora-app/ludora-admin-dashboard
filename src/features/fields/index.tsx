"use client";

import { useState } from "react";
import { FieldFilters } from "./components/field-filters";
import { FieldsList } from "./components/fields-list";
import { FieldsAdminFindAllFieldsAdminStatus } from "@/api/generated/model/fieldsAdminFindAllFieldsAdminStatus.api";
import type { FieldsAdminFindAllFieldsAdminSportsItem } from "@/api/generated/model/fieldsAdminFindAllFieldsAdminSportsItem.api";

export function FieldsManagement() {
  const [filters, setFilters] = useState<{
    search?: string;
    status?: FieldsAdminFindAllFieldsAdminStatus;
    sports?: FieldsAdminFindAllFieldsAdminSportsItem[];
  }>({
    status: FieldsAdminFindAllFieldsAdminStatus.PENDING,
  });

  return (
    <div className="space-y-6">
      <FieldFilters onFiltersChange={setFilters} />
      <FieldsList filters={filters} />
    </div>
  );
}
