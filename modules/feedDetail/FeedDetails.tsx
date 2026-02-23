import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { getFeedDetail } from "../../common/api/feeds";
import GradeBadge from "../../common/components/GradeBadge";
import FieldsTable from "./FieldsTable";

const gaugeArcColors: Record<string, string> = {
  "A+": "#22c55e",
  A: "#22c55e",
  B: "#3b82f6",
  C: "#f59e0b",
  D: "#f97316",
  F: "#ef4444",
};

const gradeBorderColors: Record<string, string> = {
  "A+": "border-l-green-500",
  A: "border-l-green-500",
  B: "border-l-blue-500",
  C: "border-l-amber-500",
  D: "border-l-orange-500",
  F: "border-l-red-500",
};

function ScoreGauge({ score, grade }: { score: number; grade: string }) {
  const circumference = 251.33;
  const offset = circumference * (1 - score);
  const arcColor = gaugeArcColors[grade] ?? "#71717a";

  return (
    <div className="relative w-36 h-36">
      <svg viewBox="0 0 100 100" className="w-36 h-36 -rotate-90">
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          className="stroke-zinc-200 dark:stroke-zinc-700"
          strokeWidth="10"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          style={{ stroke: arcColor }}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold font-mono text-zinc-800 dark:text-zinc-200">
          {(score * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  );
}

export default async function FeedDetails({ feedId }: { feedId: string }) {
  const locale = await getLocale();
  const t = await getTranslations();
  const feed = await getFeedDetail(feedId);

  const lastUpdated = new Date(feed.last_updated).toLocaleString(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const borderColor = gradeBorderColors[feed.overall.grade] ?? "border-l-zinc-400";

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <Link
          href={`/${locale}/feeds`}
          className="inline-block text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          {t("feedDetail.back")}
        </Link>

        <header className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Quality Report
          </p>
          <h1 className={`text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 ${!feed.agency_name ? "font-mono" : ""}`}>
            {feed.agency_name ?? feed.feed_id}
          </h1>
          {feed.agency_name && (
            <p className="font-mono text-sm text-zinc-500 dark:text-zinc-400">
              {feed.feed_id}
            </p>
          )}
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            {t("feedDetail.lastUpdated")}: {lastUpdated} &middot;{" "}
            {t("feedDetail.windowMinutes")}:{" "}
            {t("feedDetail.windowValue", { minutes: feed.window_minutes })}
          </p>
        </header>

        <section className="flex flex-col sm:flex-row gap-4">
          <div className={`flex-1 rounded-xl border-l-4 ${borderColor} border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col items-center justify-center gap-4 shadow-sm`}>
            <p className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-medium self-start">
              {t("feedDetail.overallScore")}
            </p>
            <ScoreGauge score={feed.overall.score} grade={feed.overall.grade} />
            <GradeBadge grade={feed.overall.grade} size="lg" />
          </div>

          <div className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
            <h2 className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-medium mb-4">
              {t("feedDetail.entityStats.title")}
            </h2>
            <dl className="space-y-4">
              <div className={`pl-4 border-l-2 ${borderColor}`}>
                <dt className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">
                  {t("feedDetail.entityStats.avgVehicles")}
                </dt>
                <dd className="text-2xl font-bold font-mono text-zinc-800 dark:text-zinc-200">
                  {feed.entity_stats.avg_vehicles.toFixed(1)}
                </dd>
              </div>
              <div className={`pl-4 border-l-2 ${borderColor}`}>
                <dt className="text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">
                  {t("feedDetail.entityStats.uptime")}
                </dt>
                <dd className="text-2xl font-bold font-mono text-zinc-800 dark:text-zinc-200">
                  {(feed.entity_stats.uptime_percent * 100).toFixed(1)}%
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">
              Audit Criteria
            </p>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
              {t("feedDetail.fieldsBreakdown.title")}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {t("feedDetail.fieldsBreakdown.description")}
            </p>
          </div>
          <FieldsTable fields={feed.fields} />
        </section>
      </div>
    </main>
  );
}
