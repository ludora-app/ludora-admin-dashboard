"use client";

import {
  AlertTriangle,
  Calendar,
  ClipboardList,
  LayoutDashboard,
  MapPin,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
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
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/services/auth-store";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const data = {
  navMain: [
    {
      title: "Overview",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "User Management",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Terrain Management",
      url: "/admin/terrains",
      icon: MapPin,
      items: [
        {
          title: "All Terrains",
          url: "/admin/terrains",
        },
        {
          title: "Pending Validation",
          url: "/admin/terrains/pending",
        },
      ],
    },
    {
      title: "Sessions",
      url: "/admin/sessions",
      icon: Calendar,
    },
    {
      title: "Reports",
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
      <SidebarHeader className="p-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-white/5 h-auto p-0"
              render={
                <a href="/admin/dashboard" className="flex items-center gap-3">
                  <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-violet-principal/20 text-turquoise-light shadow-card">
                    <ClipboardList className="size-5" />
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
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-bold tracking-[0.08em] text-white/35 uppercase px-4 mb-2">Platform</SidebarGroupLabel>
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
                          ? "bg-violet-principal/35 text-white border-l-3 border-turquoise-light" 
                          : "text-white/60 hover:bg-white/8 hover:text-white/85"
                      )}
                      render={
                        <a href={item.url}>
                          {item.icon && <item.icon className={cn("size-5", isActive ? "text-white" : "text-inherit")} />}
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
      <SidebarFooter className="p-4 border-t border-white/5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              onClick={handleLogout}
              className="h-11 px-4 rounded-btn text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-colors"
              render={
                <button type="button">
                  <LogOut className="size-5" />
                  <span className="font-medium">Logout</span>
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
