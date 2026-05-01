import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-surface-page min-h-screen">
        <header className="flex h-20 shrink-0 items-center gap-2 px-8 sticky top-0 bg-surface-page/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1 size-10 rounded-xl hover:bg-violet-principal/10 hover:text-violet-principal transition-colors" />
            <Separator orientation="vertical" className="mr-2 h-6 bg-secondary" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin/dashboard" className="text-text-muted hover:text-violet-principal font-semibold transition-colors">Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-text-muted" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-text-primary font-bold">Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex-1 px-8 pb-12 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
