import type { OverviewRepoSummary } from "@/features/overview/types/overview";
import { getInstallationReposPage } from "@/features/github/server/repos";

function countReposByVisibility(repos: { visibility: "public" | "private" }[]) {
  let publicCount = 0;
  let privateCount = 0;

  for (const repo of repos) {
    if (repo.visibility === "public") {
      publicCount++;
      continue;
    }

    privateCount++;
  }

  return { publicCount, privateCount };
}

export async function getInstallationRepoSummary(
  installationId: number,
): Promise<OverviewRepoSummary> {
  const page = await getInstallationReposPage(installationId, 1);
  const { publicCount, privateCount } = countReposByVisibility(page.repos);

  return {
    totalCount: page.totalCount,
    publicCount,
    privateCount,
    hasMorePages: page.hasMore,
  };
}
