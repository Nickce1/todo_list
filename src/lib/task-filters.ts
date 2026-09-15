import { createdDatePart, type Task, type Urgency } from "@/lib/tasks";

export const SORT_OPTIONS = ["date-start", "status", "emergency"] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];

export const SORT_LABELS: Record<SortOption, string> = {
  "date-start": "Date start",
  status: "Status",
  emergency: "Emergency",
};

export const SORT_DIRECTIONS = ["desc", "asc"] as const;

export type SortDirection = (typeof SORT_DIRECTIONS)[number];

export const SORT_DIRECTION_LABELS: Record<SortDirection, string> = {
  desc: "Descending",
  asc: "Ascending",
};

export const DATE_FILTER_MODES = ["from", "on"] as const;

export type DateFilterMode = (typeof DATE_FILTER_MODES)[number];

export const DATE_FILTER_LABELS: Record<DateFilterMode, string> = {
  from: "Created from",
  on: "Created on",
};

const URGENCY_RANK: Record<Urgency, number> = {
  calm: 0,
  medium: 1,
  high: 2,
};

export function isSortOption(value: string): value is SortOption {
  return SORT_OPTIONS.some((option) => option === value);
}

export function isSortDirection(value: string): value is SortDirection {
  return value === "asc" || value === "desc";
}

export function isDateFilterMode(value: string): value is DateFilterMode {
  return value === "from" || value === "on";
}

export function filterTasksByName(tasks: Task[], query: string): Task[] {
  const words = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return tasks;
  }

  return tasks.filter((task) => {
    const title = task.title.toLowerCase();
    return words.every((word) => title.includes(word));
  });
}

export function filterTasksByCreatedDate(
  tasks: Task[],
  mode: DateFilterMode,
  date: string,
): Task[] {
  if (!date) {
    return tasks;
  }

  if (mode === "on") {
    return tasks.filter((task) => createdDatePart(task.createdAt) === date);
  }

  return tasks.filter((task) => createdDatePart(task.createdAt) >= date);
}

export function filterTasks(
  tasks: Task[],
  query: string,
  dateMode: DateFilterMode,
  createdDate: string,
): Task[] {
  return filterTasksByCreatedDate(filterTasksByName(tasks, query), dateMode, createdDate);
}

export function sortTasks(
  tasks: Task[],
  sortBy: SortOption,
  direction: SortDirection,
): Task[] {
  const directionFactor = direction === "asc" ? 1 : -1;

  return [...tasks].sort((left, right) => {
    let comparison = 0;

    if (sortBy === "date-start") {
      comparison = left.createdAt.localeCompare(right.createdAt);
    } else if (sortBy === "status") {
      comparison = Number(left.completed) - Number(right.completed);
    } else {
      comparison = URGENCY_RANK[left.urgency] - URGENCY_RANK[right.urgency];
    }

    if (comparison !== 0) {
      return comparison * directionFactor;
    }

    return left.title.localeCompare(right.title);
  });
}
