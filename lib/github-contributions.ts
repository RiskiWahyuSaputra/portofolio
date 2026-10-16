// Parses GitHub's public contributions calendar
// (https://github.com/users/<name>/contributions). Shared by the page (live
// data, revalidated hourly) and scripts/fetch-github-contributions.mjs (which
// refreshes the JSON fallback). Keep this file free of Next/React imports so
// Node can load it directly.

export const GITHUB_USERNAME = "RiskiWahyuSaputra";

export type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

export type ContributionData = {
  totalContributions: number;
  weeks: { days: ContributionDay[] }[];
};

export const contributionsUrl = (username: string) =>
  `https://github.com/users/${username}/contributions`;

export function parseContributions(html: string): ContributionData {
  // Jumlah kontribusi per hari ada di tooltip, dihubungkan lewat id sel
  const counts: Record<string, number> = {};
  for (const m of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const num = m[2].match(/^([\d,]+) contribution/);
    counts[m[1]] = num ? parseInt(num[1].replace(/,/g, ""), 10) : 0;
  }

  const days: ContributionDay[] = [];
  for (const m of html.matchAll(/<td[^>]*data-date="([^"]+)"[^>]*id="([^"]+)"[^>]*data-level="(\d)"/g)) {
    days.push({ date: m[1], count: counts[m[2]] ?? 0, level: parseInt(m[3], 10) });
  }
  if (days.length === 0) {
    throw new Error("No contribution days found — GitHub markup may have changed");
  }

  // Tabel GitHub disusun per baris (hari), jadi urutkan per tanggal lalu kelompokkan per minggu (Minggu–Sabtu)
  days.sort((a, b) => a.date.localeCompare(b.date));
  const weeks: ContributionData["weeks"] = [];
  for (const day of days) {
    if (weeks.length === 0 || new Date(`${day.date}T00:00:00Z`).getUTCDay() === 0) {
      weeks.push({ days: [] });
    }
    weeks[weeks.length - 1].days.push(day);
  }

  return {
    totalContributions: days.reduce((sum, d) => sum + d.count, 0),
    weeks,
  };
}
