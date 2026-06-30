"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GitBranch, LayoutIcon, Settings } from "lucide-react";
import { GitHubIcon } from "@/features/auth/components/github-sign-in-form";
import {
  DASHBOARD_NAV_ITEMS,
  type DashboardRoute,
} from "@/features/dashboard/lib/routes";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const NAV_ICONS = {
  "layout-dashboard": LayoutIcon,
  "folder-git-2": GitBranch,
  github: GitHubIcon,
  settings: Settings,
} as const;

function isNavActive(pathname: string, href: DashboardRoute) {
  if (href === "/dashboard") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspace</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {DASHBOARD_NAV_ITEMS.map((item) => {
            const Icon = NAV_ICONS[item.icon];
            const active = isNavActive(pathname, item.href);

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={active}
                  tooltip={item.title}
                  className="w-full"
                >
                  <Link
                    href={item.href}
                    className="flex w-full items-center gap-2"
                  >
                    <Icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
