import type { Urgency } from "@/lib/tasks";
import { URGENCY_LABELS } from "@/lib/tasks";

const URGENCY_STYLES: Record<Urgency, string> = {
  calm: "bg-emerald-500 text-white",
  medium: "bg-amber-400 text-zinc-950",
  high: "bg-rose-500 text-white",
};

type UrgencyBadgeProps = {
  urgency: Urgency;
};

export function UrgencyBadge({ urgency }: UrgencyBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${URGENCY_STYLES[urgency]}`}
    >
      {URGENCY_LABELS[urgency]}
    </span>
  );
}
