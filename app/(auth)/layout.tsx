import { requireUnAuth } from "@/features/auth/actions";
import { ModeToggle } from "@/components/ui/mode-toggle";
import React from "react";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUnAuth();

  return (
    <div className="relative flex min-h-svh flex-1 flex-col bg-muted/30">
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,var(--primary)/0.08,transparent)]"
      />
    </div>
  );
}
