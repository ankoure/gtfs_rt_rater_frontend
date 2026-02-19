const gradeStyles: Record<string, { sm: string; lg: string }> = {
  "A+": {
    sm: "bg-green-500 text-white",
    lg: "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200 dark:shadow-green-900",
  },
  A: {
    sm: "bg-green-500 text-white",
    lg: "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200 dark:shadow-green-900",
  },
  B: {
    sm: "bg-blue-500 text-white",
    lg: "bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900",
  },
  C: {
    sm: "bg-amber-500 text-white",
    lg: "bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-200 dark:shadow-amber-900",
  },
  D: {
    sm: "bg-orange-500 text-white",
    lg: "bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-200 dark:shadow-orange-900",
  },
  F: {
    sm: "bg-red-600 text-white",
    lg: "bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-lg shadow-red-200 dark:shadow-red-900",
  },
};

const fallbackStyle = {
  sm: "bg-zinc-400 text-white",
  lg: "bg-zinc-400 text-white",
};

interface GradeBadgeProps {
  grade: string;
  size?: "sm" | "lg";
}

export default function GradeBadge({ grade, size = "sm" }: GradeBadgeProps) {
  const style = gradeStyles[grade] ?? fallbackStyle;
  const sizeClass =
    size === "lg"
      ? "text-4xl font-bold px-6 py-2.5 rounded-2xl"
      : "text-xs font-bold px-2.5 py-0.5 rounded-full";

  return (
    <span className={`inline-block ${sizeClass} ${size === "lg" ? style.lg : style.sm}`}>
      {grade}
    </span>
  );
}
