"use client";

import { Building2, ShieldCheck, User } from "lucide-react";
import type { AdminFindOneFieldResponseData } from "@/api/generated/model/adminFindOneFieldResponseData.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface FieldInfoSectionProps {
  field: AdminFindOneFieldResponseData;
}

export function FieldInfoSection({ field }: FieldInfoSectionProps) {
  const { partner, creator } = field;

  return (
    <div className="space-y-6">
      {/* Partner Section */}
      <Card className="soft-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4 text-turquoise-medium" />
            Partenaire
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {partner ? (
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  ID Partenaire
                </span>
                <p className="text-xs font-mono text-text-primary truncate">{partner.uid}</p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Rang
                </span>
                <p className="text-sm text-text-secondary">{partner.rank}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-text-muted italic">Aucun partenaire associé</p>
          )}
        </CardContent>
      </Card>

      {/* Creator Section */}
      <Card className="soft-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-violet-principal" />
            Créateur
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 pb-2">
            <div className="h-10 w-10 rounded-full bg-surface-secondary flex items-center justify-center text-violet-principal border border-violet-principal/10">
              <User className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-bold text-text-primary">
                {creator.firstname} {creator.lastname}
              </p>
              <p className="text-xs text-text-muted flex items-center gap-1">
                ID: {creator.uid?.slice(0, 8)}...
              </p>
            </div>
          </div>

          <Separator className="bg-border/50" />

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-text-secondary">
                <ShieldCheck className="h-4 w-4 text-turquoise-medium" />
                <span className="text-xs">Email vérifié</span>
              </div>
              <span className="text-xs font-bold text-text-primary uppercase">
                {creator.isEmailVerified ? "Oui" : "Non"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
