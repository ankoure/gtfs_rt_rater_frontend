import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { getFeeds } from "../../common/api/feeds";

const gradeOrder = ["A+", "A", "B", "C", "D", "F"];

const gradeBarColors: Record<string, string> = {
  "A+": "bg-green-500",
  A: "bg-green-400",
  B: "bg-blue-500",
  C: "bg-amber-400",
  D: "bg-orange-500",
  F: "bg-red-500",
};

const gradeLegendColors: Record<string, string> = {
  "A+": "bg-green-500",
  A: "bg-green-400",
  B: "bg-blue-500",
  C: "bg-amber-400",
  D: "bg-orange-500",
  F: "bg-red-500",
};

export default async function LandingPage() {
  const locale = await getLocale();
  const t = await getTranslations("landing");
  const { generated_at, feeds } = await getFeeds();

  const avgScore =
    feeds.reduce((sum, f) => sum + f.overall_score, 0) / feeds.length;

  const updatedDate = new Date(generated_at).toLocaleDateString(locale, {
    dateStyle: "medium",
  });

  const gradeCounts: Record<string, number> = {};
  feeds.forEach((f) => {
    gradeCounts[f.overall_grade] = (gradeCounts[f.overall_grade] || 0) + 1;
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="w-full max-w-2xl space-y-10">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Quality Report &middot; {updatedDate}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t("title")}
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {t("subtitle")}
          </p>
        </header>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Grade Distribution
          </p>
          <div className="overflow-hidden rounded-full h-4 flex w-full bg-zinc-200 dark:bg-zinc-800">
            {gradeOrder.map((grade) => {
              const count = gradeCounts[grade] || 0;
              if (count === 0) return null;
              const pct = (count / feeds.length) * 100;
              return (
                <div
                  key={grade}
                  className={`h-4 ${gradeBarColors[grade]} transition-all`}
                  style={{ width: `${pct}%` }}
                  title={`${grade}: ${count} feeds`}
                />
              );
            })}
          </div>
          <div className="flex gap-4 flex-wrap">
            {gradeOrder
              .filter((g) => gradeCounts[g])
              .map((grade) => (
                <div
                  key={grade}
                  className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400"
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${gradeLegendColors[grade]}`}
                  />
                  <span>
                    {grade}: {gradeCounts[grade]}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <dt className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-medium mb-1">
              {t("stats.feedsMonitored")}
            </dt>
            <dd className="text-3xl font-bold font-mono text-zinc-800 dark:text-zinc-200">
              {feeds.length}
            </dd>
          </div>
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <dt className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-medium mb-1">
              {t("stats.avgScore")}
            </dt>
            <dd className="text-3xl font-bold font-mono text-zinc-800 dark:text-zinc-200">
              {(avgScore * 100).toFixed(0)}%
            </dd>
          </div>
        </dl>

        <Link
          href={`/${locale}/feeds`}
          className="inline-block rounded-lg bg-zinc-900 dark:bg-zinc-50 px-6 py-3 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
        >
          {t("cta")} →
        </Link>
      </div>
    </main>
  );
}
