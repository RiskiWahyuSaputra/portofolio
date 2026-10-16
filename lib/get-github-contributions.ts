import fallbackData from "@/components/github-data.json";
import {
  contributionsUrl,
  GITHUB_USERNAME,
  parseContributions,
  type ContributionData,
} from "./github-contributions";

// GitHub is re-read at most once an hour, so new commits (e.g. after merging a
// branch into a repo's default branch) show up without a redeploy.
export const GITHUB_REVALIDATE_SECONDS = 3600;

export async function getGitHubContributions(): Promise<ContributionData> {
  try {
    const res = await fetch(contributionsUrl(GITHUB_USERNAME), {
      next: { revalidate: GITHUB_REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error(`GitHub responded with ${res.status}`);
    return parseContributions(await res.text());
  } catch (err) {
    // Keep the section working with the last snapshot if GitHub is unreachable
    console.warn("[github] Using bundled contribution data:", (err as Error).message);
    return fallbackData;
  }
}
