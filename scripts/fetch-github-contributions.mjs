// Refreshes components/github-data.json, the fallback the site uses when it
// can't reach GitHub. The page itself reads GitHub live (revalidated hourly),
// see lib/get-github-contributions.ts.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
// Parser dipakai bersama dengan halaman (Node menjalankan .ts secara langsung)
import { contributionsUrl, GITHUB_USERNAME, parseContributions } from "../lib/github-contributions.ts";

const OUTPUT = fileURLToPath(new URL("../components/github-data.json", import.meta.url));

async function main() {
  const res = await fetch(contributionsUrl(GITHUB_USERNAME));
  if (!res.ok) throw new Error(`GitHub responded with ${res.status}`);
  const data = parseContributions(await res.text());

  fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2) + "\n");
  const days = data.weeks.flatMap((w) => w.days);
  console.log(
    `Saved ${days.length} days (${days[0].date} → ${days[days.length - 1].date}), ` +
      `${data.totalContributions} contributions, ${days.filter((d) => d.level > 0).length} active days`
  );
}

// --soft (dipakai saat build): kalau GitHub tidak bisa diakses, pakai data lama
// yang sudah ada daripada menggagalkan build
const SOFT = process.argv.includes("--soft");

main().catch((err) => {
  if (SOFT) {
    console.warn(`[github] Gagal memperbarui data kontribusi, memakai data lama: ${err.message}`);
    return;
  }
  console.error(err);
  process.exit(1);
});
