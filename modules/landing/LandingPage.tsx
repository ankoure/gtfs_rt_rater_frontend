import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { getFeeds } from "../../common/api/feeds";

export default async function LandingPage() {
  const locale = await getLocale();
  const t = await getTranslations("landing");
  const { generated_at, feeds } = getFeeds();

  const avgScore =
    feeds.reduce((sum, f) => sum + f.overall_score, 0) / feeds.length;

  const updatedDate = new Date(generated_at).toLocaleDateString(locale, {
    dateStyle: "medium",
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="w-full max-w-2xl space-y-10">
        <header className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t("title")}
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {t("subtitle")}
          </p>
        </header>

        <dl className="grid grid-cols-3 gap-4">
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
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <dt className="text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-medium mb-1">
              {t("stats.lastUpdated")}
            </dt>
            <dd className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
              {updatedDate}
            </dd>
          </div>
        </dl>

        <Link
          href={`/${locale}/feeds`}
          className="inline-block rounded-lg bg-zinc-900 dark:bg-zinc-50 px-6 py-3 text-sm font-semibold text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
        >
          {t("cta")}
        </Link>
      </div>
    </main>
  );
}
