import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { getFeeds } from "../../common/api/feeds";
import GradeBadge from "../../common/components/GradeBadge";

export default async function FeedsList() {
  const locale = await getLocale();
  const t = await getTranslations("feeds");
  const { generated_at, feeds } = getFeeds();

  const generatedDate = new Date(generated_at).toLocaleString(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <Link
            href={`/${locale}`}
            className="inline-block text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors mb-4"
          >
            {t("back")}
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t("title")}
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">{t("subtitle")}</p>
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-600">
            {t("generatedAt", { date: generatedDate })}
          </p>
        </header>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-100 dark:bg-zinc-800 text-left text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">{t("table.feedId")}</th>
                <th className="px-5 py-3 font-medium text-center">
                  {t("table.grade")}
                </th>
                <th className="px-5 py-3 font-medium text-right">
                  {t("table.score")}
                </th>
                <th className="px-5 py-3 font-medium text-right">
                  {t("table.uptime")}
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {feeds.map((feed) => (
                <tr
                  key={feed.feed_id}
                  className="bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <td className="px-5 py-4 font-mono font-medium text-zinc-800 dark:text-zinc-200">
                    {feed.feed_id}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <GradeBadge grade={feed.overall_grade} />
                  </td>
                  <td className="px-5 py-4 text-right font-mono text-zinc-600 dark:text-zinc-400">
                    {(feed.overall_score * 100).toFixed(0)}%
                  </td>
                  <td className="px-5 py-4 text-right font-mono text-zinc-600 dark:text-zinc-400">
                    {(feed.uptime_percent * 100).toFixed(0)}%
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/${locale}/feeds/${feed.feed_id}`}
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {t("viewDetails")} →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
