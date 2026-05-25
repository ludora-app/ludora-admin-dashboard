"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FieldImagesCarouselProps {
  images?: { url: string; order: number }[];
}

export function FieldImagesCarousel({ images = [] }: FieldImagesCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = React.useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  React.useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const sortedImages = React.useMemo(() => [...images].sort((a, b) => a.order - b.order), [images]);

  if (sortedImages.length === 0) {
    return (
      <div className="aspect-video w-full rounded-card bg-muted flex items-center justify-center border-2 border-dashed border-border">
        <div className="flex flex-col items-center gap-2 text-text-muted">
          <ImageIcon className="h-10 w-10" />
          <p className="text-sm font-medium">Aucune image disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="overflow-hidden rounded-card shadow-card" ref={emblaRef}>
        <div className="flex">
          {sortedImages.map((image, index) => (
            <div className="relative flex-[0_0_100%] min-w-0 aspect-video" key={image.url}>
              <Image
                src={image.url}
                alt={`Field image ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
              />
            </div>
          ))}
        </div>
      </div>

      {sortedImages.length > 1 && (
        <>
          <div className="absolute top-1/2 -translate-y-1/2 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white/80 backdrop-blur-sm shadow-md h-9 w-9 border-none hover:bg-white"
              onClick={scrollPrev}
              type="button"
            >
              <ChevronLeft className="h-5 w-5 text-violet-deep" />
            </Button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-white/80 backdrop-blur-sm shadow-md h-9 w-9 border-none hover:bg-white"
              onClick={scrollNext}
              type="button"
            >
              <ChevronRight className="h-5 w-5 text-violet-deep" />
            </Button>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {sortedImages.map((image, index) => (
              <div
                key={image.url}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  index === selectedIndex ? "w-6 bg-white shadow-sm" : "w-1.5 bg-white/50",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
