import {
  DATE_FILTER_LABELS,
  DATE_FILTER_MODES,
  isDateFilterMode,
  isSortOption,
  SORT_LABELS,
  SORT_OPTIONS,
  type DateFilterMode,
  type SortOption,
} from "@/lib/task-filters";

const fieldClassName =
  "h-11 rounded-xl border border-border bg-surface px-3 text-sm text-foreground outline-none ring-ring placeholder:text-muted focus:ring-2";

type TaskFiltersProps = {
  query: string;
  sortBy: SortOption;
  dateMode: DateFilterMode;
  createdDate: string;
  autoFocus?: boolean;
  onQueryChange: (query: string) => void;
  onSortChange: (sortBy: SortOption) => void;
  onDateModeChange: (mode: DateFilterMode) => void;
  onCreatedDateChange: (date: string) => void;
};

export function TaskFilters({
  query,
  sortBy,
  dateMode,
  createdDate,
  autoFocus = false,
  onQueryChange,
  onSortChange,
  onDateModeChange,
  onCreatedDateChange,
}: TaskFiltersProps) {
  return (
    <div id="task-filters" className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="task-search" className="sr-only">
          Search tasks
        </label>
        <input
          id="task-search"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by name"
          autoComplete="off"
          autoFocus={autoFocus}
          className={`min-w-0 flex-1 ${fieldClassName}`}
        />
        <label htmlFor="task-sort" className="sr-only">
          Sort tasks
        </label>
        <select
          id="task-sort"
          value={sortBy}
          onChange={(event) => {
            if (isSortOption(event.target.value)) {
              onSortChange(event.target.value);
            }
          }}
          className={`sm:w-40 ${fieldClassName}`}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {SORT_LABELS[option]}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="task-date-mode" className="sr-only">
          Date filter
        </label>
        <select
          id="task-date-mode"
          value={dateMode}
          onChange={(event) => {
            if (isDateFilterMode(event.target.value)) {
              onDateModeChange(event.target.value);
            }
          }}
          className={`sm:w-40 ${fieldClassName}`}
        >
          {DATE_FILTER_MODES.map((mode) => (
            <option key={mode} value={mode}>
              {DATE_FILTER_LABELS[mode]}
            </option>
          ))}
        </select>
        <label htmlFor="task-created-date" className="sr-only">
          Creation date
        </label>
        <input
          id="task-created-date"
          type="date"
          value={createdDate}
          onChange={(event) => onCreatedDateChange(event.target.value)}
          className={`min-w-0 flex-1 ${fieldClassName}`}
        />
      </div>
    </div>
  );
}
