"use client";

import { ExternalLink, GitBranch, PlugZap } from "lucide-react";

import type { GithubInstallationStatus } from "@/features/dashboard/lib/types";
import {
  statusBadge,
  statusButtonClass,
} from "@/features/dashboard/lib/status-style";
import { getGithubInstallUrl } from "@/features/github/utils/github-app";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { disconnectGithubApp } from "../actions";

type GithubConnectCardProps = {
  userId: string;
  installation: GithubInstallationStatus;
};

function ConnectedDetails({ accountLogin }: { accountLogin: string | null }) {
  return (
    <p className="text-sm text-muted-foreground">
      Installed for{" "}
      <span className="font-medium text-green-700 dark:text-green-400">
        @{accountLogin}
      </span>
      . The app can read repository metadata and post review comments on pull
      requests.
    </p>
  );
}

function DisconnectedDetails() {
  return (
    <ul className="space-y-2 text-sm text-muted-foreground">
      <li className="flex items-start gap-2">
        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
        Access public and private repositories you select
      </li>
      <li className="flex items-start gap-2">
        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
        Receive webhooks for pull request events
      </li>
      <li className="flex items-start gap-2">
        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
        Post AI-generated review comments on PRs
      </li>
    </ul>
  );
}

function ConnectedActions() {
  return (
    <form action={disconnectGithubApp}>
      <Button
        type="submit"
        variant="outline"
        className={statusButtonClass.danger}
      >
        <PlugZap className="size-4" />
        Disconnect GitHub App
      </Button>
    </form>
  );
}

function DisconnectedActions({ installUrl }: { installUrl: string }) {
  return (
    <Button asChild className={statusButtonClass.success}>
      <a href={installUrl}>
        <GitBranch className="size-4" />
        Install GitHub App
        <ExternalLink className="size-3 opacity-80" />
      </a>
    </Button>
  );
}

function ConnectionDetails({
  connected,
  accountLogin,
}: {
  connected: boolean;
  accountLogin: string | null;
}) {
  if (connected) {
    return <ConnectedDetails accountLogin={accountLogin} />;
  }

  return <DisconnectedDetails />;
}

function ConnectionActions({
  connected,
  installUrl,
}: {
  connected: boolean;
  installUrl: string;
}) {
  if (connected) {
    return <ConnectedActions />;
  }

  return <DisconnectedActions installUrl={installUrl} />;
}

export function GithubConnectCard({
  userId,
  installation,
}: GithubConnectCardProps) {
  const { connected, accountLogin } = installation;
  const installUrl = getGithubInstallUrl(userId);

  let cardBorderClass = "border-border";
  let iconWrapperClass = "border-border bg-muted";
  let statusTone: "success" | "neutral" = "neutral";
  let statusLabel = "Not connected";

  if (connected) {
    cardBorderClass = "border-green-500/30 bg-green-500/[0.03]";
    iconWrapperClass =
      "border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-400";
    statusTone = "success";
    statusLabel = "Connected";
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
      <Card className={cn("max-w-2xl transition-colors", cardBorderClass)}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "flex size-12 items-center justify-center rounded-xl border",
                  iconWrapperClass,
                )}
              >
                <GitBranch className="size-6" />
              </span>
              <div>
                <CardTitle>GitHub App</CardTitle>
                <CardDescription>
                  Install gitPal on your GitHub account or organization to access
                  repositories and enable AI reviews.
                </CardDescription>
              </div>
            </div>
            <span className={statusBadge(statusTone)}>{statusLabel}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ConnectionDetails
            connected={connected}
            accountLogin={accountLogin}
          />
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <ConnectionActions connected={connected} installUrl={installUrl} />
        </CardFooter>
      </Card>
    </div>
  );
}
