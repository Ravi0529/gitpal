"use client";

import { ModeToggle } from "@/components/ui/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

type DashboardHeaderProps = {
  title: string;
  description?: string;
};

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-4 backdrop-blur-md">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex min-w-0 flex-1 flex-col">
        <h1 className="truncate font-heading text-sm font-semibold">{title}</h1>
        {description ? (
          <p className="truncate text-xs text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      <ModeToggle />
    </header>
  );
}
