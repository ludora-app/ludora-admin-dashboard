"use client";

import * as React from "react";
import {
  AlertCircle,
  Ban,
  ChevronLeft,
  ChevronRight,
  Flag,
  Inbox,
  RefreshCw,
  ShieldAlert,
  X,
} from "lucide-react";

import {
  useUsersAdminFindAllUsersOrderedByReports,
  useUsersAdminBanUser,
  getUsersAdminFindAllUsersOrderedByReportsQueryKey,
} from "@/api/generated/api/users-admin/users-admin.api";
import { UsersAdminFindAllUsersOrderedByReportsReportReason } from "@/api/generated/model/usersAdminFindAllUsersOrderedByReportsReportReason.api";
import { CreateUserBanParamDtoBanReason } from "@/api/generated/model/createUserBanParamDtoBanReason.api";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";

import { ReportedUserCard, ReportDetailsModal } from "@/features/reports";
import type { UserForBan } from "@/features/reports";

export default function ReportsPage() {
  const queryClient = useQueryClient();

  // Filters State
  const [reportReason, setReportReason] = React.useState<
    UsersAdminFindAllUsersOrderedByReportsReportReason | undefined
  >(undefined);

  // Pagination State
  const [cursorHistory, setCursorHistory] = React.useState<(string | undefined)[]>([undefined]);
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);
  const currentCursor = cursorHistory[currentPageIndex];

  // Selected User for Detail Modal
  const [selectedUserUid, setSelectedUserUid] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Ban User Dialog State
  const [userToBan, setUserToBan] = React.useState<UserForBan | null>(null);
  const [banReason, setBanReason] = React.useState<CreateUserBanParamDtoBanReason>("SPAM");
  const [banError, setBanError] = React.useState<string | null>(null);

  const limit = 12;

  // Main Query - List of Reported Users
  const { data, isLoading, isError, error, refetch, isFetching } =
    useUsersAdminFindAllUsersOrderedByReports({
      limit,
      cursor: currentCursor,
      reportReason,
    });

  // Ban Mutation
  const banMutation = useUsersAdminBanUser({
    mutation: {
      onSuccess: () => {
        // Invalidate queries to refresh lists
        queryClient.invalidateQueries({
          queryKey: [getUsersAdminFindAllUsersOrderedByReportsQueryKey()[0]],
        });
        // Reset states
        setUserToBan(null);
        setIsModalOpen(false);
        setSelectedUserUid(null);
        setBanError(null);
      },
      onError: (err: any) => {
        const errorMsg =
          err?.response?.data?.message || err?.message || "Échec du bannissement.";
        setBanError(Array.isArray(errorMsg) ? errorMsg.join(", ") : errorMsg);
      },
    },
  });

  // Reset pagination when filter changes
  const handleFilterChange = (reason: UsersAdminFindAllUsersOrderedByReportsReportReason | undefined) => {
    setReportReason(reason);
    setCursorHistory([undefined]);
    setCurrentPageIndex(0);
  };

  // Pagination navigation helpers
  const nextCursor = data?.status === 200 ? data.data.data.nextCursor : null;
  const reportedUsers = data?.status === 200 ? data.data.data.items : [];
  const totalCount = data?.status === 200 ? data.data.data.totalCount : 0;

  const handleNextPage = () => {
    if (nextCursor) {
      const nextIndex = currentPageIndex + 1;
      if (cursorHistory.length <= nextIndex) {
        setCursorHistory([...cursorHistory, nextCursor]);
      }
      setCurrentPageIndex(nextIndex);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  // Open Reports Details Modal
  const handleOpenDetails = (uid: string) => {
    setSelectedUserUid(uid);
    setIsModalOpen(true);
  };

  // Initiate Ban process
  const handleInitiateBan = (user: UserForBan) => {
    setUserToBan(user);
    setBanReason("SPAM");
    setBanError(null);
  };

  // Execute Ban
  const handleConfirmBan = () => {
    if (userToBan) {
      banMutation.mutate({
        uid: userToBan.uid,
        data: { banReason },
      });
    }
  };

  // Calculate local quick statistics from loaded data to make layout look richer
  const cumulativeReports = reportedUsers.reduce((sum, u) => sum + u.reportCount, 0);
  const highRiskCount = reportedUsers.filter((u) => u.reportCount >= 5).length;

  const skeletonKeys = Array.from({ length: 8 }, (_, i) => `skeleton-card-${i}`);

  return (
    <div className="flex flex-col gap-8 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary mb-2">
            Centre de Modération
          </h1>
          <p className="text-text-secondary font-medium">
            Gérez les signalements faits à l'encontre des utilisateurs et appliquez les sanctions.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isLoading || isFetching}
          className="btn-secondary gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Rafraîchir
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="metric-card">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-text-muted uppercase tracking-wider">
              Utilisateurs Signalés
            </span>
            <div className="h-10 w-10 rounded-xl bg-violet-principal/10 flex items-center justify-center text-violet-principal">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-text-primary">
            {isLoading ? <Skeleton className="h-9 w-20" /> : totalCount}
          </div>
          <p className="text-xs text-text-secondary mt-1 font-medium">
            Nombre total de comptes sous surveillance
          </p>
        </div>

        <div className="metric-card">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-text-muted uppercase tracking-wider">
              Signalements Totaux
            </span>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Flag className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-text-primary">
            {isLoading ? (
              <Skeleton className="h-9 w-20" />
            ) : (
              cumulativeReports.toLocaleString()
            )}
          </div>
          <p className="text-xs text-text-secondary mt-1 font-medium">
            Cumulés sur la page actuelle
          </p>
        </div>

        <div className="metric-card">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-text-muted uppercase tracking-wider">
              Profils Haut Risque (≥ 5)
            </span>
            <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600">
              <Ban className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-text-primary">
            {isLoading ? <Skeleton className="h-9 w-20" /> : highRiskCount}
          </div>
          <p className="text-xs text-text-secondary mt-1 font-medium">
            Utilisateurs cumulant plus de 5 rapports
          </p>
        </div>
      </div>

      {/* Tab Filters */}
      <div className="flex flex-wrap gap-2 items-center bg-surface-secondary/50 p-1.5 rounded-xl border border-secondary/50 self-start">
        <button
          type="button"
          onClick={() => handleFilterChange(undefined)}
          className={`px-4 py-2 rounded-btn text-sm font-bold transition-all duration-200 ${
            reportReason === undefined
              ? "bg-violet-principal text-white shadow-md shadow-violet-principal/20"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
          }`}
        >
          Tous les motifs
        </button>
        {Object.keys(UsersAdminFindAllUsersOrderedByReportsReportReason).map((key) => {
          const reason = UsersAdminFindAllUsersOrderedByReportsReportReason[
            key as keyof typeof UsersAdminFindAllUsersOrderedByReportsReportReason
          ];
          const isActive = reportReason === reason;
          return (
            <button
              key={reason}
              type="button"
              onClick={() => handleFilterChange(reason)}
              className={`px-4 py-2 rounded-btn text-sm font-bold transition-all duration-200 capitalize ${
                isActive
                  ? "bg-violet-principal text-white shadow-md shadow-violet-principal/20"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
              }`}
            >
              {reason.toLowerCase()}
            </button>
          );
        })}
      </div>

      {/* List content / Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {skeletonKeys.map((id) => (
            <Card key={id} className="soft-card overflow-hidden h-[240px] p-6 space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-full shrink-0 animate-pulse" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
              <Skeleton className="h-5 w-1/3 rounded-badge" />
              <div className="flex gap-2 pt-4">
                <Skeleton className="h-9 flex-1 rounded-btn" />
                <Skeleton className="h-9 w-12 rounded-btn" />
              </div>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-error/5 rounded-card border border-error/10 max-w-lg mx-auto">
          <AlertCircle className="h-12 w-12 text-[#7A2020] mb-4" />
          <h3 className="text-xl font-bold text-[#7A2020] mb-2">
            Échec du chargement des signalements
          </h3>
          <p className="text-text-secondary mb-6">
            {(error as Error | null)?.message || "Une erreur inattendue est survenue lors de l'appel API."}
          </p>
          <Button onClick={() => refetch()} className="btn-primary">
            Réessayer
          </Button>
        </div>
      ) : reportedUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center bg-card rounded-card shadow-card max-w-2xl mx-auto">
          <Inbox className="h-16 w-16 text-text-muted mb-4" />
          <h3 className="text-xl font-bold text-text-primary mb-2">Aucun utilisateur signalé</h3>
          <p className="text-text-secondary max-w-md">
            Félicitations ! Aucun utilisateur ne correspond à ce filtre de signalement actuellement.
          </p>
        </div>
      ) : (
        <>
          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {reportedUsers.map((user) => (
              <ReportedUserCard
                key={user.uid}
                user={user}
                onOpenDetails={handleOpenDetails}
                onInitiateBan={handleInitiateBan}
              />
            ))}
          </div>

          {/* Pagination Footer */}
          {totalCount > limit && (
            <div className="flex items-center justify-between border-t border-secondary pt-6 mt-4">
              <p className="text-xs text-text-muted font-medium">
                Affichage de la page {currentPageIndex + 1}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPageIndex === 0 || isFetching}
                  className="btn-secondary h-9"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={!nextCursor || isFetching}
                  className="btn-secondary h-9"
                >
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Reports Details Modal */}
      <ReportDetailsModal
        selectedUserUid={selectedUserUid}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onInitiateBan={handleInitiateBan}
      />

      {/* Ban Confirmation Modal (Portal-like state modal) */}
      {userToBan && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-violet-night/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-modal shadow-xl p-6 relative border border-secondary animate-in zoom-in-95 duration-200 flex flex-col gap-4">
            <button
              type="button"
              className="absolute top-4 right-4 text-text-muted hover:text-text-primary"
              onClick={() => setUserToBan(null)}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header icon */}
            <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-600">
              <Ban className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-text-primary mb-1">
                Bannir l'utilisateur ?
              </h3>
              <p className="text-sm text-text-secondary font-medium">
                Vous êtes sur le point de bannir définitivement{" "}
                <span className="font-bold text-text-primary">
                  {userToBan.firstname} {userToBan.lastname}
                </span>{" "}
                de la plateforme. Cette action bloquera ses accès.
              </p>
            </div>

            {/* Select Reason */}
            <div className="space-y-1.5">
              <label htmlFor="ban-reason" className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                Motif du bannissement
              </label>
              <select
                id="ban-reason"
                className="w-full p-3 rounded-btn border border-[#D0E8E8] text-sm text-text-primary bg-card focus:border-violet-principal focus:ring-3 focus:ring-violet-principal/12 outline-none transition-all shadow-input"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value as CreateUserBanParamDtoBanReason)}
              >
                {Object.keys(CreateUserBanParamDtoBanReason).map((key) => {
                  const val = CreateUserBanParamDtoBanReason[
                    key as keyof typeof CreateUserBanParamDtoBanReason
                  ];
                  return (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  );
                })}
              </select>
            </div>

            {banError && (
              <div className="bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-lg border border-red-200 flex items-start gap-1.5">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{banError}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="outline"
                className="btn-secondary h-10 px-4"
                disabled={banMutation.isPending}
                onClick={() => setUserToBan(null)}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                className="h-10 px-5"
                disabled={banMutation.isPending}
                onClick={handleConfirmBan}
              >
                {banMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-1" />
                    Bannissement...
                  </>
                ) : (
                  "Confirmer"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
