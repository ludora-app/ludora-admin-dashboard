"use client";

import { Trophy } from "lucide-react";
import type { AdminFindOneFieldResponseData } from "@/api/generated/model/adminFindOneFieldResponseData.api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { BadgeProps } from "@/components/ui/badge";

interface FieldSportsSectionProps {
  field: AdminFindOneFieldResponseData;
}

export function FieldSportsSection({ field }: FieldSportsSectionProps) {
  return (
    <Card className="soft-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Trophy className="h-4 w-4 text-turquoise-medium" />
          Sports pratiqués
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {field.sports.map((sport) => (
            <Badge
              key={sport}
              variant={sport as BadgeProps["variant"]}
              className="px-3 py-1 shadow-sm transition-transform hover:scale-105"
            >
              {sport.toLowerCase()}
            </Badge>
          ))}
          {field.sports.length === 0 && (
            <p className="text-sm text-text-muted italic">Aucun sport configuré</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

