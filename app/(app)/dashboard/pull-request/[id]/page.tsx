import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowLeftIcon,
  BotIcon,
  ExternalLinkIcon,
  GitBranchIcon,
  GitPullRequestIcon,
  UserIcon,
} from "lucide-react";

import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { statusBadge } from "@/features/dashboard/lib/status-style";
import { getUserInstallationId } from "@/features/github/server/installation";
import { AiReviewMarkdown } from "@/features/pull-requests/components/ai-review-markdown";
import { getPullRequestById } from "@/features/pull-requests/server/get-pull-requests";
import type { PullRequestStatus } from "@/features/pull-requests/types/pull-request";
import {
  PR_STATUS_LABELS,
  getPrStatusTone,
} from "@/features/pull-requests/utils/status";
import { requireAuth } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Pull Request Review - Dashboard",
};

function ReviewBody({
  review,
  status,
}: {
  review: string | null;
  status: PullRequestStatus;
}) {
  if (status === "rate_limited") {
    return (
      <p className="text-sm text-muted-foreground">
        Monthly review limit reached. Upgrade to Pro for unlimited reviews, or
        wait until next month when your limit resets.
      </p>
    );
  }

  if (!review) {
    return (
      <p className="text-sm text-muted-foreground">
        The AI review is not ready yet. It will appear here once the reviewer
        finishes.
      </p>
    );
  }

  return <AiReviewMarkdown review={review} />;
}

export default async function PullRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireAuth();
  const installationId = await getUserInstallationId(session.user.id);

  if (!installationId) {
    notFound();
  }

  const pullRequest = await getPullRequestById(installationId, id);

  if (!pullRequest) {
    notFound();
  }

  const status = pullRequest.status as PullRequestStatus;
  const prUrl = `https://github.com/${pullRequest.repoFullName}/pull/${pullRequest.prNumber}`;
  const openedAgo = formatDistanceToNow(pullRequest.createdAt, {
    addSuffix: true,
  });

  return (
    <>
      <DashboardHeader
        title={`PR #${pullRequest.prNumber}`}
        description={pullRequest.repoFullName}
      />

      <div className="flex flex-col gap-6 p-4 sm:p-6">
        <div>
          <Link href={DASHBOARD_ROUTES.pullRequest}>
            <Button variant="ghost" size="sm">
              <ArrowLeftIcon />
              Back to pull requests
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-muted">
                <GitPullRequestIcon className="size-5 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <CardTitle className="text-base leading-snug">
                  {pullRequest.title}
                </CardTitle>
                <CardDescription>
                  #{pullRequest.prNumber} · {pullRequest.repoFullName}
                </CardDescription>
              </div>
              <span className={statusBadge(getPrStatusTone(status))}>
                {PR_STATUS_LABELS[status]}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <UserIcon className="size-3.5" />
                {pullRequest.authorLogin ?? "unknown"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <GitBranchIcon className="size-3.5" />
                {pullRequest.baseBranch}
              </span>
              <span>opened {openedAgo}</span>
              <Link
                href={prUrl}
                target="_blank"
                className="ml-auto inline-flex items-center gap-1 transition-colors hover:text-foreground hover:underline"
              >
                View on GitHub
                <ExternalLinkIcon className="size-3.5" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                <BotIcon className="size-5" />
              </div>
              <div>
                <CardTitle>AI Review</CardTitle>
                <CardDescription>
                  Automated feedback generated by gitPal
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <ReviewBody review={pullRequest.reviewComment} status={status} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
