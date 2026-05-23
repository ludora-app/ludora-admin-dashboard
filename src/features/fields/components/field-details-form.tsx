"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Hourglass, Info, Loader2, MapPin, Settings2, X } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { getFieldsAdminFindOneForAdminQueryKey, useFieldsAdminUpdate } from "@/api/generated/api/fields-admin/fields-admin.api";
import type { AdminFindOneFieldResponseData } from "@/api/generated/model/adminFindOneFieldResponseData.api";
import { ImageFieldAdminDtoStatus } from "@/api/generated/model/imageFieldAdminDtoStatus.api";
import { UpdateFieldAdminFormDtoStatus } from "@/api/generated/model/updateFieldAdminFormDtoStatus.api";
import type { UpdateFieldAdminFormDtoSportsItem } from "@/api/generated/model/updateFieldAdminFormDtoSportsItem.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldPhotosSection, PhotoState } from "./field-photos-section";

const fieldUpdateSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  address: z.string().min(5, "L'adresse est trop courte"),
  status: z.nativeEnum(UpdateFieldAdminFormDtoStatus),
});

type FieldUpdateValues = z.infer<typeof fieldUpdateSchema>;

interface FieldDetailsFormProps {
  field: AdminFindOneFieldResponseData;
}

export function FieldDetailsForm({ field }: FieldDetailsFormProps) {
  const queryClient = useQueryClient();
  const [photos, setPhotos] = React.useState<PhotoState[]>(() => 
    field.fieldImages.map((img, index) => ({
      uid: img.uid,
      url: img.url,
      status: img.status as ImageFieldAdminDtoStatus,
      order: img.order ?? index,
      isNew: false,
      isDeleted: false,
    }))
  );

  const { mutate, isPending } = useFieldsAdminUpdate({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getFieldsAdminFindOneForAdminQueryKey(field.uid),
        });
        alert("Terrain mis à jour avec succès !");
      },
      onError: (error: any) => {
        const errorData = error?.response?.data;
        const message = errorData?.message || error?.message || "Une erreur est survenue lors de la mise à jour.";
        alert(`Erreur : ${Array.isArray(message) ? message.join(", ") : message}`);
      },
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldUpdateValues>({
    resolver: zodResolver(fieldUpdateSchema),
    defaultValues: {
      name: field.name || "",
      address: field.address || "",
      status: field.status as UpdateFieldAdminFormDtoStatus,
    },
  });

  const onSubmit = (data: FieldUpdateValues) => {
    // Metadata for all non-deleted images (existing keep their uid, new ones don't have uid)
    const imagesMetadata = photos
      .filter((p) => !p.isDeleted)
      .map((p) => ({
        uid: p.isNew ? undefined : p.uid,
        name: p.file?.name ?? "image.jpg",
        order: p.order,
        status: p.status,
      }));

    // Only new files go in 'images' as Blob[] (type expected by the DTO)
    const newFiles = photos
      .filter((p) => p.isNew && !p.isDeleted && p.file)
      .map((p) => p.file! as Blob);

    mutate({
      uid: field.uid,
      data: {
        name: data.name,
        address: data.address,
        status: data.status,
        sports: field.sports as unknown as UpdateFieldAdminFormDtoSportsItem[],
        imagesMetadata: JSON.stringify(imagesMetadata),
        images: newFiles.length > 0 ? newFiles : undefined,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Photo Management Section */}
      <FieldPhotosSection initialImages={field.fieldImages} onChange={setPhotos} />

      {/* Status & Type Header */}
      <Card className="soft-card">
        <CardContent className="p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-violet-principal/10 flex items-center justify-center text-violet-principal shadow-sm">
              <Settings2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">Configuration</h2>
              <p className="text-sm text-text-secondary">
                Gérez l'état et la visibilité du terrain
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="status-select" className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
              Modifier le statut
            </Label>
            <div className="flex items-center gap-3">
              <select
                id="status-select"
                className="min-w-[140px] h-9 px-3 rounded-btn border border-border bg-background text-xs shadow-input focus:outline-none focus:ring-2 focus:ring-violet-principal/20"
                {...register("status")}
              >
                <option value={UpdateFieldAdminFormDtoStatus.PENDING}>En attente</option>
                <option value={UpdateFieldAdminFormDtoStatus.APPROVED}>Vérifié</option>
                <option value={UpdateFieldAdminFormDtoStatus.REJECTED}>Rejeté</option>
              </select>
              <div className="h-8 w-[1px] bg-border mx-1" />
              <Badge
                variant="secondary"
                className="px-3 py-1 h-8 bg-surface-secondary text-violet-deep border-none"
              >
                {field.type === "PUBLIC" ? "Public" : "Privé"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Information */}
        <Card className="soft-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-turquoise-medium" />
              Informations Générales
            </CardTitle>
            <CardDescription>Détails principaux du terrain de sport</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du terrain</Label>
              <Input id="name" className="shadow-input" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type de terrain (Lecture seule)</Label>
              <Input id="type" value={field.type} disabled className="bg-muted/50" />
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card className="soft-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-violet-principal" />
              Localisation
            </CardTitle>
            <CardDescription>Coordonnées et adresse précise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Adresse complète</Label>
              <Input id="address" className="shadow-input" {...register("address")} />
              {errors.address && (
                <p className="text-xs text-destructive">{errors.address.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortAddress">Adresse courte (Lecture seule)</Label>
              <Input
                id="shortAddress"
                value={field.shortAddress}
                disabled
                className="bg-muted/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude (Lecture seule)</Label>
                <Input
                  id="latitude"
                  value={field.latitude}
                  disabled
                  className="bg-muted/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude (Lecture seule)</Label>
                <Input
                  id="longitude"
                  value={field.longitude}
                  disabled
                  className="bg-muted/50"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-4">
        <Button 
          type="submit" 
          className="btn-primary w-full md:w-auto px-12 gap-2"
          disabled={isPending}
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Enregistrer les modifications
        </Button>
      </div>
    </form>
  );
}
