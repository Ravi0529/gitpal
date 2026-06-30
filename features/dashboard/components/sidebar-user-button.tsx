"use client";

import { useEffect, useState } from "react";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { UserMenu, UserMenuUser } from "@/features/auth/components/user-menu";

type SidebarUserButtonProps = {
  user: UserMenuUser;
  plan?: string;
};

function useSidebarState() {
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const sidebar = document.querySelector('[data-slot="sidebar"]');

    if (!sidebar) {
      return;
    }

    const updateState = () => {
      setIsExpanded(sidebar.getAttribute("data-state") !== "collapsed");
    };

    updateState();

    const observer = new MutationObserver(updateState);
    observer.observe(sidebar, {
      attributes: true,
      attributeFilter: ["data-state"],
    });

    return () => observer.disconnect();
  }, []);

  return isExpanded;
}

export function SidebarUserButton({ user, plan }: SidebarUserButtonProps) {
  const isExpanded = useSidebarState();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <UserMenu
          user={user}
          plan={plan}
          variant={isExpanded ? "profile" : "compact"}
          className="w-full [&_button]:h-12 [&_button]:w-full [&_button]:justify-start [&_button]:gap-2 [&_button]:px-3"
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
