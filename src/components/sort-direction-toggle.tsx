import type { SortDirection } from "@/lib/task-filters";

type SortDirectionToggleProps = {
  direction: SortDirection;
  onToggle: () => void;
};

function AscendingIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden="true"
    >
      <path d="m8 10 4-4 4 4" />
      <path d="M12 6v12" />
    </svg>
  );
}

function DescendingIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden="true"
    >
      <path d="m8 14 4 4 4-4" />
      <path d="M12 18V6" />
    </svg>
  );
}

export function SortDirectionToggle({
  direction,
  onToggle,
}: SortDirectionToggleProps) {
  const isAscending = direction === "asc";

  return (
    <button
      type="button"
      aria-label={isAscending ? "Sort ascending" : "Sort descending"}
      aria-pressed={isAscending}
      onClick={onToggle}
      className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:bg-surface-hover"
    >
      {isAscending ? <AscendingIcon /> : <DescendingIcon />}
    </button>
  );
}
