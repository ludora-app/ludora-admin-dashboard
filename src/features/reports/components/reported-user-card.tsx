"use client";

import * as React from "react";
import { CheckCircle, Eye, Ban, Flag } from "lucide-react";
import Image from "next/image";
import type { FindAllReportedUsersResponseData } from "@/api/generated/model/findAllReportedUsersResponseData.api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export interface UserForBan {
  uid: string;
  firstname: string;
  lastname: string;
}

interface ReportedUserCardProps {
  user: FindAllReportedUsersResponseData;
  onOpenDetails: (uid: string) => void;
  onInitiateBan: (user: UserForBan) => void;
}

export function ReportedUserCard({ user, onOpenDetails, onInitiateBan }: ReportedUserCardProps) {
  const [imgError, setImgError] = React.useState(false);
  const hasHighRisk = user.reportCount >= 5;

  const getInitials = (firstname: string, lastname: string) => {
    const f = firstname?.charAt(0) || "";
    const l = lastname?.charAt(0) || "";
    return `${f}${l}`.toUpperCase() || "?";
  };

  return (
    <Card className="soft-card flex flex-col justify-between h-full group p-6">
      <div>
        {/* Card Header & Avatar */}
        <div className="flex items-start gap-4">
          {user.imageUrl && !imgError ? (
            <Image
              src={user.imageUrl}
              alt={`${user.firstname} ${user.lastname}`}
              width={56}
              height={56}
              unoptimized
              onError={() => setImgError(true)}
              className="size-14 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="size-14 rounded-full bg-linear-to-br from-violet-principal/20 to-violet-deep/20 text-violet-deep font-bold text-lg shadow-sm flex items-center justify-center">
              {getInitials(user.firstname, user.lastname)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-base text-text-primary truncate">
                {user.firstname} {user.lastname}
              </h3>
              {user.isEmailVerified && (
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" aria-label="Email vérifié" />
              )}
            </div>
            <p className="text-xs text-text-muted font-medium truncate mb-2">
              {user.email || "Aucun email"}
            </p>
          </div>
        </div>

        {/* Report count and gender attributes */}
        <div className="flex flex-wrap gap-2 mt-4 pt-1">
          <Badge
            variant={hasHighRisk ? "error" : "warning"}
            className="font-bold text-[11px] gap-1 px-2.5"
          >
            <Flag className="h-3 w-3 shrink-0" />
            {user.reportCount} {user.reportCount > 1 ? "signalements" : "signalement"}
          </Badge>
          {user.sex && (
            <Badge variant="info" className="text-[10px] font-semibold px-2 uppercase">
              {user.sex === "MALE" ? "Homme" : user.sex === "FEMALE" ? "Femme" : "Autre"}
            </Badge>
          )}
        </div>
      </div>

      {/* Actions buttons */}
      <div className="flex gap-2 border-t border-secondary mt-6 pt-4">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs gap-1.5 h-9"
          onClick={() => onOpenDetails(user.uid)}
        >
          <Eye className="h-3.5 w-3.5" />
          Détails
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="text-xs gap-1.5 h-9 shrink-0"
          onClick={() =>
            onInitiateBan({
              uid: user.uid,
              firstname: user.firstname,
              lastname: user.lastname,
            })
          }
        >
          <Ban className="h-3.5 w-3.5" />
          Bannir
        </Button>
      </div>
    </Card>
  );
}
