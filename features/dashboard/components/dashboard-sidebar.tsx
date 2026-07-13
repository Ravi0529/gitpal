import Image from "next/image";
import Link from "next/link";

import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { DashboardNav } from "@/features/dashboard/components/dashboard-nav";
import { SidebarUserButton } from "@/features/dashboard/components/sidebar-user-button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { UserMenuUser } from "@/features/auth/components/user-menu";

type DashboardSidebarProps = {
  user: UserMenuUser;
  plan?: string;
};

export function DashboardSidebar({
  user,
  plan = "Free",
}: DashboardSidebarProps) {
  return (
    <Sidebar collapsible="icon" className="group">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="gitPal" className="h-14 px-2">
              <Link
                href={DASHBOARD_ROUTES.overview}
                className="flex w-full items-center justify-start gap-3"
              >
                <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-sidebar-border bg-sidebar">
                  <Image
                    src="/logo-dark.svg"
                    alt="gitPal logo"
                    width={36}
                    height={36}
                    className="size-7 object-contain"
                  />
                </span>
                <span className="font-heading text-lg font-semibold tracking-tight text-sidebar-foreground transition-opacity duration-200 group-data-[state=collapsed]:hidden">
                  gitPal
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <DashboardNav />
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarUserButton user={user} plan={plan} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
