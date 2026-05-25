"use client";

import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import * as React from "react";
import { useGeolocalisationGetAddressAutocomplete } from "@/api/generated/api/geolocalisation/geolocalisation.api";
import type { AddressAutocompleteResponseData } from "@/api/generated/model/addressAutocompleteResponseData.api";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface AddressAutocompleteProps {
  value?: string;
  onChange: (value: string) => void;
  onSelect: (addressData: AddressAutocompleteResponseData) => void;
  placeholder?: string;
  className?: string;
}

export function AddressAutocomplete({
  value = "",
  onChange,
  onSelect,
  placeholder = "Commencez à taper l'adresse (min. 15 caractères)...",
  className,
}: AddressAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState(value);

  // Sync internal search query with external value if needed (e.g. form reset)
  React.useEffect(() => {
    setSearchQuery(value);
  }, [value]);

  const { data, isLoading, isFetching } = useGeolocalisationGetAddressAutocomplete(
    { address: searchQuery },
    {
      query: {
        enabled: searchQuery.length >= 15 && open,
      },
    },
  );

  // Robust path to suggestions to handle different potential Orval/customInstance nesting
  const suggestions = React.useMemo(() => {
    if (!data) return [];

    const response = data as any;

    // Option 1: Nesting according to models and customInstance (response.data.data.items)
    // response.data is the body, response.data.data is the payload
    if (response.data?.data?.items) {
      return response.data.data.items as AddressAutocompleteResponseData[];
    }

    // Option 2: response.data.items (standard Orval wrapping if body was payload)
    if (response.data?.items) {
      return response.data.items as AddressAutocompleteResponseData[];
    }

    // Option 3: response.items (if somehow not wrapped by customInstance)
    if (response.items) {
      return response.items as AddressAutocompleteResponseData[];
    }

    return [] as AddressAutocompleteResponseData[];
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    onChange(newValue);

    // Auto-open popover if we reach the threshold
    if (newValue.length >= 15) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const showLoading = (isLoading || isFetching) && suggestions.length === 0;
  const showNoResults =
    !isLoading && !isFetching && suggestions.length === 0 && searchQuery.length >= 15;

  return (
    <div className={cn("relative w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={handleInputChange}
              placeholder={placeholder}
              className="pr-10"
              onFocus={() => {
                if (searchQuery.length >= 15) setOpen(true);
              }}
              // Ensure we don't trigger form submit on enter in the input
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {(isLoading || isFetching) && (
                <Loader2 className="h-4 w-4 animate-spin text-text-muted/60" />
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 text-text-muted" />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="p-1 w-[400px] max-w-[calc(100vw-2rem)] overflow-hidden bg-popover border border-border shadow-xl rounded-xl z-50"
          align="start"
          sideOffset={8}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            {showLoading && (
              <div className="py-8 text-center text-sm flex flex-col items-center justify-center gap-3 text-text-muted">
                <Loader2 className="h-5 w-5 animate-spin text-violet-principal" />
                <span>Recherche d'adresses...</span>
              </div>
            )}

            {showNoResults && (
              <div className="py-8 text-center text-sm text-text-muted flex flex-col items-center gap-2">
                <span className="text-lg">📍</span>
                <span>Aucune adresse trouvée pour cette recherche.</span>
              </div>
            )}

            {searchQuery.length > 0 && searchQuery.length < 15 && (
              <div className="py-4 px-3 text-center text-xs text-text-muted bg-surface-secondary/50 rounded-lg mx-1">
                Continuez à taper pour voir les suggestions (encore {15 - searchQuery.length}{" "}
                caractères)
              </div>
            )}

            <div className="flex flex-col gap-0.5">
              {suggestions.map((item) => (
                <button
                  key={`${item.address}-${item.latitude}-${item.longitude}`}
                  type="button"
                  onClick={() => {
                    onSelect(item);
                    setSearchQuery(item.address);
                    setOpen(false);
                  }}
                  className={cn(
                    "group w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all text-left",
                    "hover:bg-violet-principal/10 hover:text-violet-principal",
                    value === item.address
                      ? "bg-violet-principal/5 text-violet-principal font-medium"
                      : "text-text-primary",
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center h-5 w-5 rounded-full border shrink-0 transition-colors",
                      value === item.address
                        ? "bg-violet-principal border-violet-principal text-white"
                        : "border-border text-text-muted group-hover:border-violet-principal/50",
                    )}
                  >
                    {value === item.address ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <span className="text-[10px] opacity-0 group-hover:opacity-100">GO</span>
                    )}
                  </div>
                  <span className="truncate">{item.address}</span>
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
