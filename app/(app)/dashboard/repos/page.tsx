import type { Metadata } from "next";
import Link from "next/link";
import { FolderGit2, Plug } from "lucide-react";

import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";

import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { getInstallationStatus } from "@/features/github/server/installation";

import { Button } from "@/components/ui/button";
import { requireAuth } from "@/features/auth/actions";
import { RepoList } from "@/features/dashboard/components/repo-list";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Repositories - Dashboard",
};

function ReposNotConnected() {
  return (
    <div className="flex flex-1 items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-xl border border-border bg-muted">
            <FolderGit2 className="size-7 text-muted-foreground" />
          </div>
          <CardTitle>Connect GitHub first</CardTitle>
          <CardDescription>
            Install the GitHub App to see your repositories and enable AI code
            reviews.
          </CardDescription>
          <Button asChild className="mt-2">
            <Link href={DASHBOARD_ROUTES.github}>
              <Plug />
              Go to GitHub App
            </Link>
          </Button>
        </CardHeader>
      </Card>
    </div>
  );
}

export default async function DashboardReposPage() {
  const session = await requireAuth();
  const installation = await getInstallationStatus(session.user.id);

  const header = (
    <DashboardHeader
      title="Repositories"
      description="All public and private repositories available to the GitHub App."
    />
  );

  if (!installation.connected) {
    return (
      <>
        {header}
        <ReposNotConnected />
      </>
    );
  }

  return (
    <>
      {header}
      <RepoList />
    </>
  );
}
