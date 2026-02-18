import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { getFeedDetail } from "../../common/api/feeds";
import GradeBadge from "../../common/components/GradeBadge";
import FieldsTable from "./FieldsTable";

export default async function FeedDetails({ feedId }: { feedId: string }) {
  const locale = await getLocale();
  const t = await getTranslations();
  const feed = getFeedDetail(feedId);

  const lastUpdated = new Date(feed.last_updated).toLocaleString(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <Link
          href={`/${locale}/feeds`}
          className="inline-block text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          {t("feedDetail.back")}
        </Link>

        <header>
          <p className="text-sm font-mono text-zinc-400 dark:text-zinc-500 mb-1">
            {t("feedDetail.lastUpdated")}: {lastUpdated} &middot;{" "}
            {t("feedDetail.windowMinutes")}:{" "}
            {t("feedDetail.windowValue", { minutes: feed.window_minutes })}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {feed.feed_id}
          </h1>
        </header>

        <section className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col items-center justify-center gap-3 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-medium">
              {t("feedDetail.overallScore")}
            </p>
            <GradeBadge grade={feed.overall.grade} size="lg" />
            <p className="text-2xl font-bold font-mono text-zinc-700 dark:text-zinc-300">
              {(feed.overall.score * 100).toFixed(0)}%
            </p>
          </div>

          <div className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
            <h2 className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-medium mb-4">
              {t("feedDetail.entityStats.title")}
            </h2>
            <dl className="space-y-3">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-zinc-600 dark:text-zinc-400">
                  {t("feedDetail.entityStats.avgVehicles")}
                </dt>
                <dd className="text-sm font-mono font-semibold text-zinc-800 dark:text-zinc-200">
                  {feed.entity_stats.avg_vehicles.toFixed(1)}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-zinc-600 dark:text-zinc-400">
                  {t("feedDetail.entityStats.uptime")}
                </dt>
                <dd className="text-sm font-mono font-semibold text-zinc-800 dark:text-zinc-200">
                  {(feed.entity_stats.uptime_percent * 100).toFixed(1)}%
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-1">
            {t("feedDetail.fieldsBreakdown.title")}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            {t("feedDetail.fieldsBreakdown.description")}
          </p>
          <FieldsTable fields={feed.fields} />
        </section>
      </div>
    </main>
  );
}
