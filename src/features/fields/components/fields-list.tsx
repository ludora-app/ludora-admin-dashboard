"use client";

import { useFieldsFindAllFieldsAdmin } from "@/api/generated/api/fields/fields.api";
import { FieldCard } from "./field-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { FieldsFindAllFieldsAdminStatus } from "@/api/generated/model/fieldsFindAllFieldsAdminStatus.api";
import type { FieldsFindAllFieldsAdminSportsItem } from "@/api/generated/model/fieldsFindAllFieldsAdminSportsItem.api";
import { AlertCircle, Inbox } from "lucide-react";

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
          <div key={i} className="space-y-3">
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
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-error/10 rounded-card border border-error/20">
        <AlertCircle className="h-10 w-10 text-destructive mb-4" />
        <h3 className="text-lg font-bold text-destructive">Failed to load fields</h3>
        <p className="text-text-secondary">
          {(error as any)?.message || "An unexpected error occurred"}
        </p>
      </div>
    );
  }

  const fields = data?.data?.data?.items || [];

  if (fields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-card shadow-card">
        <Inbox className="h-10 w-10 text-text-muted mb-4" />
        <h3 className="text-lg font-bold text-text-primary">No fields found</h3>
        <p className="text-text-secondary">Try adjusting your filters or search query.</p>
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
