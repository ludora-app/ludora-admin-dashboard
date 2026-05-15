"use client";

import { Check, Hourglass, MapPin, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { AdminFieldCollectionResponseData } from "@/api/generated/model";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface FieldCardProps {
  field: AdminFieldCollectionResponseData;
}

const statusConfig = {
  APPROVED: {
    icon: Check,
    className: "bg-[#E8F5EE] text-[#1E6B42] border-[#E8F5EE]",
    iconColor: "text-[#1E6B42]",
    label: "Vérifié",
  },
  PENDING: {
    icon: Hourglass,
    className: "bg-[#FEF4E4] text-[#7A5010] border-[#FEF4E4]",
    iconColor: "text-[#7A5010]",
    label: "En attente",
  },
  REJECTED: {
    icon: X,
    className: "bg-[#FDECEC] text-[#7A2020] border-[#FDECEC]",
    iconColor: "text-[#7A2020]",
    label: "Rejeté",
  },
} as const;

export function FieldCard({ field }: FieldCardProps) {
  // Use status if available (admin view)
  const status = ((field as any).status as string | undefined)?.toUpperCase() as
    | keyof typeof statusConfig
    | undefined;
  const config = status ? statusConfig[status] : null;
  const StatusIcon = config?.icon;

  return (
    <Link href={`/admin/fields/${field.uid}`} className="block group">
      <Card className="soft-card overflow-hidden h-full">
        <div className="relative aspect-video w-full overflow-hidden bg-muted rounded-lg">
          {field.image ? (
            <Image
              src={field.image}
              alt={field.name || "Field"}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              priority
              className="object-cover transition-transform duration-300 group-hover:scale-105 "
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-turquoise-light/20 text-turquoise-medium">
              <MapPin className="h-10 w-10" />
            </div>
          )}

          {config && StatusIcon && (
            <div
              className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-badge shadow-sm backdrop-blur-md z-10 border-transparent ${config.className}`}
            >
              <StatusIcon className={`h-3.5 w-3.5 ${config.iconColor}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{config.label}</span>
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
