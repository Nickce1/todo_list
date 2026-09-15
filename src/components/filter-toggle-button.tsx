type FilterToggleButtonProps = {
  isOpen: boolean;
  onToggle: () => void;
};

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="size-5"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function HideIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="size-5"
      aria-hidden="true"
    >
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

export function FilterToggleButton({ isOpen, onToggle }: FilterToggleButtonProps) {
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-controls="task-filters"
      aria-label={isOpen ? "Hide filter and search" : "Show filter and search"}
      onClick={onToggle}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
        isOpen
          ? "theme-action"
          : "border border-border bg-surface text-foreground hover:bg-surface-hover"
      }`}
    >
      <span
        className={`inline-flex transition-transform duration-200 ${
          isOpen ? "rotate-90" : "rotate-0"
        }`}
      >
        {isOpen ? <HideIcon /> : <SearchIcon />}
      </span>
    </button>
  );
}
