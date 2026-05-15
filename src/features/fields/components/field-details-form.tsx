"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Hourglass, Info, MapPin, Settings2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { AdminFindOneFieldResponseData } from "@/api/generated/model/adminFindOneFieldResponseData.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const fieldUpdateSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  address: z.string().min(5, "L'adresse est trop courte"),
  shortAddress: z.string().min(3, "L'adresse courte est trop courte"),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

type FieldUpdateValues = z.infer<typeof fieldUpdateSchema>;

interface FieldDetailsFormProps {
  field: AdminFindOneFieldResponseData;
}

const statusConfig = {
  APPROVED: {
    icon: Check,
    variant: "success",
    label: "Vérifié",
  },
  PENDING: {
    icon: Hourglass,
    variant: "warning",
    label: "En attente",
  },
  REJECTED: {
    icon: X,
    variant: "error",
    label: "Rejeté",
  },
} as const;

export function FieldDetailsForm({ field }: FieldDetailsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldUpdateValues>({
    resolver: zodResolver(fieldUpdateSchema),
    defaultValues: {
      name: field.name || "",
      address: field.address || "",
      shortAddress: field.shortAddress || "",
      latitude: field.latitude,
      longitude: field.longitude,
    },
  });

  const onSubmit = (data: FieldUpdateValues) => {
    console.log("Update field data:", data);
    alert("La mise à jour sera disponible prochainement.");
  };

  const status = field.status as keyof typeof statusConfig;
  const config = statusConfig[status] || statusConfig.PENDING;
  const StatusIcon = config.icon;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
          <div className="flex items-center gap-3">
            <Badge variant={config.variant as any} className="px-3 py-1 gap-1.5 h-8">
              <StatusIcon className="h-3.5 w-3.5" />
              {config.label}
            </Badge>
            <Badge
              variant="secondary"
              className="px-3 py-1 h-8 bg-surface-secondary text-violet-deep border-none"
            >
              {field.type === "PUBLIC" ? "Public" : "Privé"}
            </Badge>
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
              <Label htmlFor="shortAddress">Adresse courte (Ville / Quartier)</Label>
              <Input id="shortAddress" className="shadow-input" {...register("shortAddress")} />
              {errors.shortAddress && (
                <p className="text-xs text-destructive">{errors.shortAddress.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  className="shadow-input"
                  {...register("latitude")}
                />
                {errors.latitude && (
                  <p className="text-xs text-destructive">{errors.latitude.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  className="shadow-input"
                  {...register("longitude")}
                />
                {errors.longitude && (
                  <p className="text-xs text-destructive">{errors.longitude.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" className="btn-primary w-full md:w-auto px-12">
          Enregistrer les modifications
        </Button>
      </div>
    </form>
  );
}
