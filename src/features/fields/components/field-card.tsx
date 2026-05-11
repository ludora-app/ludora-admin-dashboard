"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { FieldResponseDto } from "@/api/generated/model/fieldResponseDto.api";
import { MapPin } from "lucide-react";

interface FieldCardProps {
  field: FieldResponseDto;
}

export function FieldCard({ field }: FieldCardProps) {
  const mainImage = field.fieldImages?.sort((a, b) => a.order - b.order)[0]?.url;

  return (
    <Link href={`/admin/fields/${field.uid}`} className="block group">
      <Card className="soft-card overflow-hidden h-full">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={field.name || "Field"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-turquoise-light/20 text-turquoise-medium">
              <MapPin className="h-10 w-10" />
            </div>
          )}
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-bold text-lg leading-tight text-text-primary line-clamp-1">
              {field.name || "Unnamed Field"}
            </h3>
            <p className="text-sm text-text-secondary flex items-start gap-1 line-clamp-2">
              <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-turquoise-medium" />
              {field.shortAddress}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {field.sports.map((sport) => (
              <Badge key={sport} variant={sport as any} className="text-[10px] px-1.5 py-0">
                {sport.toLowerCase()}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
