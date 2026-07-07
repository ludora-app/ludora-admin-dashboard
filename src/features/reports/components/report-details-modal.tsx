"use client";

import * as React from "react";
import { AlertCircle, Ban, ExternalLink, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUsersAdminFindOneWithReports } from "@/api/generated/api/users-admin/users-admin.api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { UserForBan } from "./reported-user-card";

interface ReportDetailsModalProps {
  selectedUserUid: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onInitiateBan: (user: UserForBan) => void;
}

export function ReportDetailsModal({
  selectedUserUid,
  isOpen,
  onOpenChange,
  onInitiateBan,
}: ReportDetailsModalProps) {
  // Detailed Query - Single user's report history (enabled only when dialog is open)
  const {
    data: reportsDetailData,
    isLoading: isLoadingReportsDetail,
    isError: isErrorReportsDetail,
    refetch: refetchReportsDetail,
  } = useUsersAdminFindOneWithReports(selectedUserUid || "", {
    query: {
      enabled: !!selectedUserUid && isOpen,
    },
  });

  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    setImgError(false);
  }, [selectedUserUid]);

  const getInitials = (firstname: string, lastname: string) => {
    const f = firstname?.charAt(0) || "";
    const l = lastname?.charAt(0) || "";
    return `${f}${l}`.toUpperCase() || "?";
  };

  const userData = reportsDetailData?.status === 200 ? reportsDetailData.data.data : null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card shadow-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="border-b border-secondary pb-4 mb-2">
          <DialogTitle className="text-xl font-extrabold text-text-primary">
            Historique des signalements
          </DialogTitle>
          <DialogDescription className="text-text-secondary font-medium">
            Consultez les détails des signalements émis à l'encontre de cet utilisateur.
          </DialogDescription>
        </DialogHeader>

        {isLoadingReportsDetail ? (
          <div className="space-y-6 py-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
            <Skeleton className="h-px w-full" />
            <div className="space-y-3">
              <Skeleton className="h-[80px] w-full rounded-card" />
              <Skeleton className="h-[80px] w-full rounded-card" />
            </div>
          </div>
        ) : isErrorReportsDetail ? (
          <div className="text-center py-8">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-text-secondary font-semibold">
              Impossible de charger les détails du signalement.
            </p>
            <Button
              variant="outline"
              onClick={() => refetchReportsDetail()}
              className="mt-4 text-xs gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Réessayer
            </Button>
          </div>
        ) : userData ? (
          <div className="space-y-6 py-2">
            {/* User overview block */}
            <div className="bg-surface-secondary/40 p-4 rounded-card border border-secondary flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {userData.imageUrl && !imgError ? (
                  <Image
                    src={userData.imageUrl}
                    alt="Utilisateur"
                    width={48}
                    height={48}
                    unoptimized
                    onError={() => setImgError(true)}
                    className="size-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="size-12 rounded-full bg-violet-principal/10 text-violet-principal font-bold text-sm flex items-center justify-center">
                    {getInitials(userData.firstname, userData.lastname)}
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-text-primary leading-tight truncate">
                    {userData.firstname} {userData.lastname}
                  </h4>
                  <p className="text-xs text-text-muted truncate max-w-[200px]">
                    {userData.email}
                  </p>
                </div>
              </div>

              <Link href={`/admin/users/${userData.uid}`} target="_blank">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                  title="Ouvrir le profil complet"
                >
                  <ExternalLink className="h-4 w-4 text-violet-principal" />
                </Button>
              </Link>
            </div>

            {/* Reports list */}
            <div className="space-y-4">
              <h5 className="font-bold text-xs uppercase tracking-wider text-text-muted">
                Signalements reçus ({userData.reports?.length || 0})
              </h5>

              {!userData.reports || userData.reports.length === 0 ? (
                <p className="text-xs text-text-secondary italic">Aucun détail disponible.</p>
              ) : (
                <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1">
                  {userData.reports.map((report) => (
                    <div
                      key={`${report.createdAt}-${report.reporter?.uid || "unknown"}`}
                      className="bg-card rounded-card shadow-sm border border-secondary p-4 space-y-2.5 transition-all hover:border-violet-principal/30"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <Badge variant="error" className="font-bold text-[10px] uppercase">
                          {report.reason}
                        </Badge>
                        <span className="text-[10px] text-text-muted font-medium">
                          {new Date(report.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      {report.description && (
                        <p className="text-xs text-text-secondary bg-surface-secondary/40 p-2.5 rounded-lg border-l-2 border-amber-400 italic">
                          &ldquo;{report.description}&rdquo;
                        </p>
                      )}

                      <div className="flex items-center justify-between border-t border-secondary/50 pt-2 text-[10px] text-text-muted">
                        <span>Signalé par :</span>
                        <span className="font-bold text-text-secondary">
                          {report.reporter
                            ? `${report.reporter.firstname} ${report.reporter.lastname}`
                            : "Utilisateur anonyme"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ban action inside details drawer */}
            <div className="pt-4 border-t border-secondary flex justify-end">
              <Button
                variant="destructive"
                className="w-full gap-2 font-bold text-sm"
                onClick={() =>
                  onInitiateBan({
                    uid: userData.uid,
                    firstname: userData.firstname,
                    lastname: userData.lastname,
                  })
                }
              >
                <Ban className="h-4 w-4" />
                Bannir l'utilisateur définitivement
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
