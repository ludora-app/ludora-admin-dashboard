"use client";

import { Check, Hourglass, Image as ImageIcon, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import type { ImageFieldAdminDto } from "@/api/generated/model/imageFieldAdminDto.api";
import { ImageFieldAdminDtoStatus } from "@/api/generated/model/imageFieldAdminDtoStatus.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface PhotoState {
  uid?: string;
  url?: string;
  file?: File;
  status: ImageFieldAdminDtoStatus;
  order: number;
  isNew: boolean;
  isDeleted: boolean;
}

interface FieldPhotosSectionProps {
  initialImages: ImageFieldAdminDto[];
  onChange: (images: PhotoState[]) => void;
}

const statusConfig = {
  APPROVED: {
    icon: Check,
    variant: "success",
    label: "Vérifié",
    color: "text-green-600 bg-green-50 border-green-200",
  },
  PENDING: {
    icon: Hourglass,
    variant: "warning",
    label: "En attente",
    color: "text-amber-600 bg-amber-50 border-amber-200",
  },
  REJECTED: {
    icon: X,
    variant: "error",
    label: "Rejeté",
    color: "text-red-600 bg-red-50 border-red-200",
  },
} as const;

export function FieldPhotosSection({ initialImages, onChange }: FieldPhotosSectionProps) {
  const [photos, setPhotos] = React.useState<PhotoState[]>(() =>
    initialImages.map((img, index) => ({
      uid: img.uid,
      url: img.url,
      status: img.status || ImageFieldAdminDtoStatus.PENDING,
      order: img.order ?? index,
      isNew: false,
      isDeleted: false,
    })),
  );

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const activePhotos = photos.filter((p) => !p.isDeleted);
  const canAddMore = activePhotos.length < 5;

  // Notify parent on any change
  React.useEffect(() => {
    onChange(photos);
  }, [photos, onChange]);

  const handleStatusChange = (index: number, newStatus: ImageFieldAdminDtoStatus) => {
    setPhotos((prev) => {
      const newPhotos = [...prev];
      newPhotos[index] = { ...newPhotos[index], status: newStatus };
      return newPhotos;
    });
  };

  const handleDelete = (index: number) => {
    setPhotos((prev) => {
      const newPhotos = [...prev];
      newPhotos[index] = { ...newPhotos[index], isDeleted: true };
      return newPhotos;
    });
  };

  const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = 5 - activePhotos.length;
    const filesToAdd = files.slice(0, remainingSlots);

    const newPhotos: PhotoState[] = filesToAdd.map((file, i) => ({
      url: URL.createObjectURL(file),
      file: file,
      status: ImageFieldAdminDtoStatus.APPROVED,
      order: activePhotos.length + i,
      isNew: true,
      isDeleted: false,
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);

    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="soft-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-violet-principal" />
          Gestion des Photos
        </CardTitle>
        <CardDescription>
          Ajoutez, supprimez ou modifiez le statut de vérification des photos (max 5)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, index) => {
            if (photo.isDeleted) return null;

            const currentStatus = photo.status as keyof typeof statusConfig;
            const config = statusConfig[currentStatus] || statusConfig.PENDING;
            const StatusIcon = config.icon;

            return (
              <div
                key={photo.uid || `new-${index}`}
                className="group relative flex flex-col rounded-xl border border-border bg-surface-primary overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                {/* Image Preview */}
                <div className="relative aspect-video w-full bg-muted">
                  {photo.url ? (
                    <Image
                      src={photo.url}
                      alt="Field"
                      fill
                      className="object-cover"
                      unoptimized={photo.isNew} // Use unoptimized for local blobs
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="h-8 w-8 text-text-muted" />
                    </div>
                  )}

                  {/* Delete Button */}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                    onClick={() => handleDelete(index)}
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  {/* New Label */}
                  {photo.isNew && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-violet-principal text-white text-[10px] font-bold rounded-full shadow-sm z-10">
                      NOUVEAU
                    </div>
                  )}
                </div>

                {/* Photo Actions */}
                <div className="p-3 space-y-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                      Statut de vérification
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        className="flex-1 h-8 px-2 rounded-md border border-border bg-background text-[11px] focus:outline-none focus:ring-1 focus:ring-violet-principal"
                        value={photo.status}
                        onChange={(e) => handleStatusChange(index, e.target.value as any)}
                      >
                        <option value="PENDING">En attente</option>
                        <option value="APPROVED">Vérifié</option>
                        <option value="REJECTED">Rejeté</option>
                      </select>
                      <div
                        className={cn(
                          "flex items-center justify-center h-8 w-8 rounded-md border shrink-0",
                          config.color,
                        )}
                      >
                        <StatusIcon className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Button */}
          {canAddMore && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-border bg-surface-secondary/50 hover:bg-surface-secondary hover:border-violet-principal/50 transition-all gap-2 text-text-muted hover:text-violet-principal group"
            >
              <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Plus className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">Ajouter une photo</span>
              <span className="text-[10px] text-text-muted/60">{activePhotos.length} / 5</span>
            </button>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleAddPhotos}
        />

        {activePhotos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center bg-muted/30 rounded-xl border border-dashed border-border">
            <ImageIcon className="h-12 w-12 text-text-muted/40 mb-3" />
            <p className="text-sm font-medium text-text-secondary">Aucune photo pour ce terrain</p>
            <p className="text-xs text-text-muted mt-1">
              Ajoutez jusqu'à 5 photos pour illustrer le terrain
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
