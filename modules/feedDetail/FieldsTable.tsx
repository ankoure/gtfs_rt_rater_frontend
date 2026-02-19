"use client";

import { useTranslations } from "next-intl";
import type { FieldMetric } from "../../common/types/feeds";
import GradeBadge from "../../common/components/GradeBadge";

interface FieldsTableProps {
  fields: Record<string, FieldMetric>;
}

function formatFieldKey(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function supportHeatClass(support: number): string {
  if (support >= 0.9)
    return "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400";
  if (support >= 0.7)
    return "bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
  if (support >= 0.5)
    return "bg-orange-50 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
  return "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400";
}

export default function FieldsTable({ fields }: FieldsTableProps) {
  const t = useTranslations();
  const fieldNames = useTranslations("fields");

  const rows = Object.entries(fields).sort(
    ([, a], [, b]) => b.avg_support - a.avg_support
  );

  function getFieldLabel(key: string): string {
    try {
      return fieldNames(key as Parameters<typeof fieldNames>[0]);
    } catch {
      return formatFieldKey(key);
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-zinc-50 dark:bg-zinc-800 text-left text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">
            <th className="px-4 py-3 font-medium">{t("fieldColumns.field")}</th>
            <th className="px-4 py-3 font-medium text-right">
              {t("fieldColumns.avgSupport")}
            </th>
            <th className="px-4 py-3 font-medium text-right">
              {t("fieldColumns.stddev")}
            </th>
            <th className="px-4 py-3 font-medium text-center">
              {t("fieldColumns.grade")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {rows.map(([key, metric]) => (
            <tr
              key={key}
              className="bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <td className="px-4 py-3 font-medium text-zinc-800 dark:text-zinc-200">
                {getFieldLabel(key)}
              </td>
              <td
                className={`px-4 py-3 text-right font-mono font-semibold ${supportHeatClass(metric.avg_support)}`}
              >
                {(metric.avg_support * 100).toFixed(0)}%
              </td>
              <td className="px-4 py-3 text-right font-mono text-zinc-500 dark:text-zinc-400">
                ±{(metric.stddev * 100).toFixed(0)}%
              </td>
              <td className="px-4 py-3 text-center">
                <GradeBadge grade={metric.grade} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
