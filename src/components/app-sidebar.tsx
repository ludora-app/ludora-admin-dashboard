"use client";

import { AlertTriangle, Calendar, LayoutDashboard, LogOut, MapPin, Users } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import type * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/services/auth-store";

const data = {
  navMain: [
    // {
    //   title: "Vue d'ensemble",
    //   url: "/admin/dashboard",
    //   icon: LayoutDashboard,
    // },
    // {
    //   title: "Utilisateurs",
    //   url: "/admin/users",
    //   icon: Users,
    // },
    {
      title: "Terrains",
      url: "/admin/fields",
      icon: MapPin,
      items: [
        {
          title: "Tous les terrains",
          url: "/admin/fields",
        },
        {
          title: "En attente de validation",
          url: "/admin/fields/pending",
        },
      ],
    },
    // {
    //   title: "Sessions",
    //   url: "/admin/sessions",
    //   icon: Calendar,
    // },
    {
      title: "Signalements",
      url: "/admin/reports",
      icon: AlertTriangle,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <Sidebar collapsible="icon" className="bg-violet-night border-r-white/5" {...props}>
      <SidebarHeader className="p-6 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-white/5 h-auto p-0"
              render={
                <a href="/admin/dashboard" className="flex items-center gap-3">
                  <div className="flex aspect-square size-10 group-data-[collapsible=icon]:size-8 items-center justify-center rounded-xl bg-violet-principal/20 text-turquoise-light">
                    <Image
                      src="/logo.png"
                      alt="Logo Ludora"
                      width={40}
                      height={40}
                      className="size-7 group-data-[collapsible=icon]:size-5 object-contain"
                      priority
                    />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-bold text-white text-base">Ludora Admin</span>
                    <span className="text-white/40 text-xs font-medium">Dashboard v1.0</span>
                  </div>
                </a>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-3 group-data-[collapsible=icon]:px-0">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-bold tracking-[0.08em] text-white/35 uppercase px-4 mb-2">
            Plateforme
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {data.navMain.map((item) => {
                const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isActive}
                      className={cn(
                        "h-11 px-4 rounded-btn font-medium transition-all duration-150",
                        isActive
                          ? "bg-violet-principal/35 text-white group-data-[state=expanded]:border-l-3 group-data-[state=expanded]:border-turquoise-light"
                          : "text-white/60 hover:bg-white/8 hover:text-white/85",
                      )}
                      render={
                        <a href={item.url}>
                          {item.icon && (
                            <item.icon
                              className={cn("size-5", isActive ? "text-white" : "text-inherit")}
                            />
                          )}
                          <span>{item.title}</span>
                        </a>
                      }
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-3 border-t border-white/5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Déconnexion"
              onClick={handleLogout}
              className="h-11 px-4 rounded-btn text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-colors"
              render={
                <button type="button">
                  <LogOut className="size-5" />
                  <span className="font-medium">Déconnexion</span>
                </button>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
