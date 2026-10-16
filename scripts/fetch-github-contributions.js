const fs = require("fs");
const path = require("path");

const USERNAME = "RiskiWahyuSaputra";
const OUTPUT = path.join(__dirname, "..", "components", "github-data.json");
const COLORS = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

async function main() {
  const res = await fetch(`https://github.com/users/${USERNAME}/contributions`);
  if (!res.ok) throw new Error(`GitHub responded with ${res.status}`);
  const html = await res.text();

  // Jumlah kontribusi per hari ada di tooltip, dihubungkan lewat id sel
  const counts = {};
  for (const m of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const num = m[2].match(/^([\d,]+) contribution/);
    counts[m[1]] = num ? parseInt(num[1].replace(/,/g, ""), 10) : 0;
  }

  const days = [];
  for (const m of html.matchAll(/<td[^>]*data-date="([^"]+)"[^>]*id="([^"]+)"[^>]*data-level="(\d)"/g)) {
    const level = parseInt(m[3], 10);
    days.push({ date: m[1], count: counts[m[2]] ?? 0, level, color: COLORS[level] });
  }
  if (days.length === 0) throw new Error("No contribution days found — GitHub markup may have changed");

  // Tabel GitHub disusun per baris (hari), jadi urutkan per tanggal lalu kelompokkan per minggu (Minggu–Sabtu)
  days.sort((a, b) => a.date.localeCompare(b.date));
  const weeks = [];
  for (const day of days) {
    if (weeks.length === 0 || new Date(`${day.date}T00:00:00Z`).getUTCDay() === 0) {
      weeks.push({ days: [] });
    }
    weeks[weeks.length - 1].days.push(day);
  }

  const totalContributions = days.reduce((sum, d) => sum + d.count, 0);
  fs.writeFileSync(OUTPUT, JSON.stringify({ totalContributions, weeks }, null, 2) + "\n");
  console.log(
    `Saved ${days.length} days (${days[0].date} → ${days[days.length - 1].date}), ` +
      `${totalContributions} contributions, ${days.filter((d) => d.level > 0).length} active days`
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
