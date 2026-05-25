import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-badge px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:opacity-80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:opacity-80",
        outline: "text-foreground border-border border",
        success: "border-transparent bg-[#E8F5EE] text-[#1E6B42] hover:bg-[#E8F5EE]/80",
        warning: "border-transparent bg-[#FEF4E4] text-[#7A5010] hover:bg-[#FEF4E4]/80",
        error: "border-transparent bg-[#FDECEC] text-[#7A2020] hover:bg-[#FDECEC]/80",
        info: "border-transparent bg-[#EEF0FD] text-[#2D3A8C] hover:bg-[#EEF0FD]/80",
        // Sport variants
        BASKETBALL: "border-transparent bg-[#FFF7ED] text-[#EA580C] hover:bg-[#FFF7ED]/80",
        FOOTBALL: "border-transparent bg-[#F0FDF4] text-[#16A34A] hover:bg-[#F0FDF4]/80",
        TENNIS: "border-transparent bg-[#FEFCE8] text-[#CA8A04] hover:bg-[#FEFCE8]/80",
        VOLLEYBALL: "border-transparent bg-[#F5F3FF] text-[#7C3AED] hover:bg-[#F5F3FF]/80",
        PADEL: "border-transparent bg-[#ECFEFF] text-[#0891B2] hover:bg-[#ECFEFF]/80",
        BADMINTON: "border-transparent bg-[#FFF1F2] text-[#E11D48] hover:bg-[#FFF1F2]/80",
        "PING-PONG": "border-transparent bg-[#F8FAFC] text-[#475569] hover:bg-[#F8FAFC]/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
