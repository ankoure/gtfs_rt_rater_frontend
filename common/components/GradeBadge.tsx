const gradeStyles: Record<string, string> = {
  "A+": "bg-green-100 text-green-700 ring-green-200",
  A: "bg-green-100 text-green-700 ring-green-200",
  B: "bg-blue-100 text-blue-700 ring-blue-200",
  C: "bg-amber-100 text-amber-700 ring-amber-200",
  D: "bg-orange-100 text-orange-700 ring-orange-200",
  F: "bg-red-100 text-red-700 ring-red-200",
};

const fallbackStyle = "bg-zinc-100 text-zinc-600 ring-zinc-200";

interface GradeBadgeProps {
  grade: string;
  size?: "sm" | "lg";
}

export default function GradeBadge({ grade, size = "sm" }: GradeBadgeProps) {
  const style = gradeStyles[grade] ?? fallbackStyle;
  const sizeClass =
    size === "lg"
      ? "text-4xl font-bold px-5 py-2 rounded-2xl ring-2"
      : "text-sm font-semibold px-2.5 py-0.5 rounded-full ring-1";

  return <span className={`inline-block ${sizeClass} ${style}`}>{grade}</span>;
}
