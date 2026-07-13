import type { Metadata } from "next";
import Link from "next/link";
import { GitPullRequest, Plug } from "lucide-react";

import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { getUserInstallationId } from "@/features/github/server/installation";
import { PullRequestsList } from "@/features/pull-requests/components/pull-requests-list";
import { getPullRequestsByRepo } from "@/features/pull-requests/server/get-pull-requests";
import { requireAuth } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Pull Requests - Dashboard",
};

function PullRequestsNotConnected() {
  return (
    <div className="flex flex-1 items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-xl border border-border bg-muted">
            <GitPullRequest className="size-7 text-muted-foreground" />
          </div>
          <CardTitle>Connect GitHub first</CardTitle>
          <CardDescription>
            Install the GitHub App to see AI-reviewed pull requests from your
            repositories.
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

export default async function DashboardPullRequestsPage() {
  const session = await requireAuth();
  const installationId = await getUserInstallationId(session.user.id);

  const header = (
    <DashboardHeader
      title="Pull Requests"
      description="Every pull request the AI reviewer has picked up, with its review."
    />
  );

  if (!installationId) {
    return (
      <>
        {header}
        <PullRequestsNotConnected />
      </>
    );
  }

  const repos = await getPullRequestsByRepo(installationId);

  return (
    <>
      {header}
      <PullRequestsList repos={repos} />
    </>
  );
}
