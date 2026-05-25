"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useFieldsAdminCreateField } from "@/api/generated/api/fields-admin/fields-admin.api";
import type { CreatePublicFieldFormDtoSportsItem } from "@/api/generated/model/createPublicFieldFormDtoSportsItem.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressAutocomplete } from "./address-autocomplete";
import { FieldPhotosSection, type PhotoState } from "./field-photos-section";

const fieldCreateSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  address: z.string().min(5, "L'adresse est trop courte"),
  shortAddress: z.string().optional(),
  latitude: z.number({ required_error: "La latitude est requise" }),
  longitude: z.number({ required_error: "La longitude est requise" }),
});

type FieldCreateValues = z.infer<typeof fieldCreateSchema>;

interface FieldCreateFormProps {
  selectedSports: CreatePublicFieldFormDtoSportsItem[];
}

export function FieldCreateForm({ selectedSports }: FieldCreateFormProps) {
  const router = useRouter();
  const [photos, setPhotos] = React.useState<PhotoState[]>([]);

  const { mutate, isPending } = useFieldsAdminCreateField({
    mutation: {
      onSuccess: (response) => {
        const responseData = (response as any).data?.data || (response as any).data;
        const newFieldUid = responseData?.uid;

        if (newFieldUid) {
          // Use window.location.href for a clean full-page load
          // to avoid potential client-side routing issues in experimental Next.js versions
          window.location.href = `/admin/fields/${newFieldUid}`;
        } else {
          router.push("/admin/fields");
        }
      },
      onError: (error: any) => {
        const errorData = error?.response?.data;
        const message =
          errorData?.message || error?.message || "Une erreur est survenue lors de la création.";
        alert(`Erreur : ${Array.isArray(message) ? message.join(", ") : message}`);
      },
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldCreateValues>({
    resolver: zodResolver(fieldCreateSchema),
    defaultValues: {
      name: "",
      address: "",
      shortAddress: "",
    },
  });

  const watchedLocation = watch(["shortAddress", "latitude", "longitude"]);

  const onSubmit = (data: FieldCreateValues) => {
    if (selectedSports.length === 0) {
      alert("Veuillez sélectionner au moins un sport.");
      return;
    }

    const newFiles = photos
      .filter((p) => p.isNew && !p.isDeleted && p.file)
      .map((p) => p.file! as Blob);

    mutate({
      data: {
        name: data.name,
        address: data.address,
        shortAddress: data.shortAddress,
        lat: data.latitude,
        lng: data.longitude,
        sports: selectedSports,
        images: newFiles.length > 0 ? newFiles : undefined,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Photo Management Section */}
      <FieldPhotosSection initialImages={[]} onChange={setPhotos} />

      {/* Main Info */}
      <Card className="soft-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-violet-principal" />
            Informations Générales
          </CardTitle>
          <CardDescription>Saisissez les informations de base du terrain</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du terrain</Label>
              <Input
                id="name"
                placeholder="Ex: City Stade Municipal"
                {...register("name")}
                className="shadow-input"
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card className="soft-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-turquoise-medium" />
            Localisation
          </CardTitle>
          <CardDescription>Utilisez l'autocomplétion pour trouver l'adresse exacte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="address">Adresse complète</Label>
            <AddressAutocomplete
              value={watch("address")}
              onChange={(val) => setValue("address", val)}
              onSelect={(data) => {
                setValue("address", data.address);
                setValue("shortAddress", data.shortAddress);
                setValue("latitude", data.latitude);
                setValue("longitude", data.longitude);
              }}
            />
            {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shortAddress">Adresse courte</Label>
              <Input
                id="shortAddress"
                {...register("shortAddress")}
                className="bg-surface-secondary/50"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={watchedLocation[1] || ""}
                onChange={(e) => setValue("latitude", parseFloat(e.target.value))}
                className="bg-surface-secondary/50"
                readOnly
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
                value={watchedLocation[2] || ""}
                onChange={(e) => setValue("longitude", parseFloat(e.target.value))}
                className="bg-surface-secondary/50"
                readOnly
              />
              {errors.longitude && (
                <p className="text-xs text-destructive">{errors.longitude.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 sm:bottom-8 sm:right-8 sm:left-auto z-50 animate-in fade-in slide-in-from-bottom-6 duration-500">
        <div className="bg-card/95 backdrop-blur-xl border-t sm:border border-border/40 sm:border-violet-principal/20 sm:rounded-2xl p-4 sm:p-3 shadow-[0_-8px_30px_rgb(0,0,0,0.08)] sm:shadow-2xl flex items-center justify-center sm:justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
            className="btn-secondary flex-1 sm:flex-initial"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="btn-primary flex-1 sm:min-w-[150px] shadow-lg gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Création...
              </>
            ) : (
              "Créer le terrain"
            )}
          </Button>
        </div>
      </div>

      <div className="h-24" />
    </form>
  );
}
