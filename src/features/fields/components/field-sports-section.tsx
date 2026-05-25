"use client";

import { Check, Pencil, Trophy } from "lucide-react";
import * as React from "react";
import { UpdateFieldAdminFormDtoSportsItem } from "@/api/generated/model/updateFieldAdminFormDtoSportsItem.api";
import type { BadgeProps } from "@/components/ui/badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FieldSportsSectionProps {
  selectedSports: UpdateFieldAdminFormDtoSportsItem[];
  onSportsChange: (sports: UpdateFieldAdminFormDtoSportsItem[]) => void;
}

export function FieldSportsSection({ selectedSports, onSportsChange }: FieldSportsSectionProps) {
  const [isEditing, setIsEditing] = React.useState(false);

  const toggleSport = (sport: UpdateFieldAdminFormDtoSportsItem) => {
    if (selectedSports.includes(sport)) {
      onSportsChange(selectedSports.filter((s) => s !== sport));
    } else {
      onSportsChange([...selectedSports, sport]);
    }
  };

  return (
    <Card className="soft-card">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base flex items-center gap-2">
          <Trophy className="h-4 w-4 text-turquoise-medium" />
          Sports pratiqués
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 rounded-full transition-colors",
            isEditing
              ? "bg-turquoise-medium/10 text-turquoise-medium hover:bg-turquoise-medium/20"
              : "hover:bg-violet-principal/10 text-violet-principal",
          )}
          onClick={() => setIsEditing(!isEditing)}
          title={isEditing ? "Valider la sélection" : "Modifier les sports"}
        >
          {isEditing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {isEditing ? (
            // Edit Mode: Show all sports
            Object.values(UpdateFieldAdminFormDtoSportsItem).map((sport) => {
              const isSelected = selectedSports.includes(sport);
              return (
                <Badge
                  key={sport}
                  variant={isSelected ? (sport as BadgeProps["variant"]) : "outline"}
                  className={cn(
                    "px-3 py-1 cursor-pointer transition-all hover:scale-105 select-none",
                    !isSelected &&
                      "bg-background border-border text-text-muted hover:bg-surface-secondary hover:text-text-primary",
                    isSelected && "shadow-sm",
                  )}
                  onClick={() => toggleSport(sport)}
                >
                  {sport.toLowerCase()}
                </Badge>
              );
            })
          ) : (
            // View Mode: Show only selected sports
            <>
              {selectedSports.map((sport) => (
                <Badge
                  key={sport}
                  variant={sport as BadgeProps["variant"]}
                  className="px-3 py-1 shadow-sm transition-transform hover:scale-105"
                >
                  {sport.toLowerCase()}
                </Badge>
              ))}
              {selectedSports.length === 0 && (
                <p className="text-sm text-text-muted italic">Aucun sport configuré</p>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
