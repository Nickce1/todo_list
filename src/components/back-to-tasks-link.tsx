import Link from "next/link";

function BackIcon() {
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
      <path d="M15 18 9 12l6-6" />
    </svg>
  );
}

export function BackToTasksLink() {
  return (
    <Link
      href="/"
      aria-label="Back to tasks"
      className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition-colors hover:bg-surface-hover"
    >
      <BackIcon />
    </Link>
  );
}
