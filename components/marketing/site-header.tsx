import Image from "next/image";
import Link from "next/link";

import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          <Image
            src="/logo-dark.svg"
            alt="gitPal logo"
            width={28}
            height={28}
            className="size-7 object-contain"
            priority
          />
          <span className="font-heading text-lg font-semibold tracking-tight">
            gitPal
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a
            href="#features"
            className="transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="transition-colors hover:text-foreground"
          >
            How it works
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hidden sm:inline-flex"
          ></Button>
          <Button size="sm" asChild>
            <Link href="/sign-in">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
