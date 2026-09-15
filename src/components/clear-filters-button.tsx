type ClearFiltersButtonProps = {
  disabled?: boolean;
  onClear: () => void;
};

function EraserIcon() {
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
      <path d="m7 21-4.3-4.3a1 1 0 0 1 0-1.4l9.6-9.6a1 1 0 0 1 1.4 0l6.6 6.6a1 1 0 0 1 0 1.4L13 21" />
      <path d="M8 7 16 15" />
      <path d="M5 21h14" />
    </svg>
  );
}

export function ClearFiltersButton({
  disabled = false,
  onClear,
}: ClearFiltersButtonProps) {
  return (
    <button
      type="button"
      aria-label="Clear filters"
      disabled={disabled}
      onClick={onClear}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40"
    >
      <EraserIcon />
    </button>
  );
}
