import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { UserUsageBar } from "@/components/user-usage-bar";
import { MobileAppNav } from "@/components/mobile-app-nav";
import { MobileSidebarButton } from "@/components/mobile-sidebar-button";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex min-h-dvh w-full min-w-0 flex-1 basis-0 flex-col">
        <div className="sticky top-0 z-30 border-b bg-background/95 px-3 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 backdrop-blur md:px-6 md:pt-4">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-3 flex items-center gap-2 md:hidden">
              <MobileSidebarButton />
              <div className="min-w-0">
                <p className="truncate font-semibold text-sm">Langclaw</p>
                <p className="truncate text-muted-foreground text-xs">
                  Celo / USDT research
                </p>
              </div>
            </div>
            <UserUsageBar />
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-1 flex-col px-3 pt-4 pb-[calc(5.75rem+env(safe-area-inset-bottom))] md:px-6 md:py-8">
          {children}
        </div>
      </main>
      <MobileAppNav />
    </SidebarProvider>
  );
}
