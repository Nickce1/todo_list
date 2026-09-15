export const URGENCY_LEVELS = ["calm", "medium", "high"] as const;

export type Urgency = (typeof URGENCY_LEVELS)[number];

export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  dueDate: string | null;
  urgency: Urgency;
};

export type TaskUpdates = Pick<
  Task,
  "title" | "description" | "completed" | "dueDate" | "urgency"
>;

const STORAGE_KEY = "todolist:tasks:v2";
const LEGACY_STORAGE_KEY = "todolist:tasks:v1";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DATE_TIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const URGENCY_LABELS: Record<Urgency, string> = {
  calm: "Calm",
  medium: "Medium",
  high: "High",
};

export function todayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function nowDateTimeString(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${todayDateString()}T${hours}:${minutes}`;
}

export function createdDatePart(value: string): string {
  return value.slice(0, 10);
}

export function formatTaskDate(date: string): string {
  if (!isDateString(date)) {
    return date;
  }

  const [year, month, day] = date.split("-").map(Number);

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export function formatTaskDateTime(value: string): string {
  const normalized = normalizeCreatedAt(value);

  if (!normalized) {
    return value;
  }

  const [datePart, timePart] = normalized.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(year, month - 1, day, hours, minutes));
}

export function isUrgency(value: unknown): value is Urgency {
  return URGENCY_LEVELS.some((level) => level === value);
}

export function createTask(
  title: string,
  overrides: Partial<Omit<Task, "id" | "title">> = {},
): Task {
  return {
    id: crypto.randomUUID(),
    title,
    description: "",
    completed: false,
    createdAt: nowDateTimeString(),
    dueDate: null,
    urgency: "calm",
    ...overrides,
  };
}

const SEED_TASKS: Task[] = [
  {
    id: "seed-1",
    title: "Review today's priorities",
    description: "Go through the calendar and pick the top three.",
    completed: false,
    createdAt: "2026-09-11T09:00",
    dueDate: "2026-09-11",
    urgency: "high",
  },
  {
    id: "seed-2",
    title: "Reply to unread messages",
    description: "Answer the design team about the latest mockups.",
    completed: false,
    createdAt: "2026-09-10T14:30",
    dueDate: "2026-09-12",
    urgency: "medium",
  },
  {
    id: "seed-3",
    title: "Plan tomorrow's tasks",
    description: "Sketch a short list for tomorrow morning.",
    completed: true,
    createdAt: "2026-09-09T18:15",
    dueDate: "2026-09-10",
    urgency: "calm",
  },
];

function isDateString(value: unknown): value is string {
  if (typeof value !== "string" || !DATE_PATTERN.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function isDateTimeString(value: unknown): value is string {
  if (typeof value !== "string" || !DATE_TIME_PATTERN.test(value)) {
    return false;
  }

  const [datePart, timePart] = value.split("T");
  const [hours, minutes] = timePart.split(":").map(Number);

  return (
    isDateString(datePart) &&
    hours >= 0 &&
    hours <= 23 &&
    minutes >= 0 &&
    minutes <= 59
  );
}

function normalizeCreatedAt(value: unknown): string | null {
  if (isDateTimeString(value)) {
    return value;
  }

  if (isDateString(value)) {
    return `${value}T00:00`;
  }

  return null;
}

function normalizeTask(value: unknown): Task | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const task = value as Record<string, unknown>;

  if (
    typeof task.id !== "string" ||
    typeof task.title !== "string" ||
    typeof task.completed !== "boolean"
  ) {
    return null;
  }

  return {
    id: task.id,
    title: task.title,
    description: typeof task.description === "string" ? task.description : "",
    completed: task.completed,
    createdAt: normalizeCreatedAt(task.createdAt) ?? nowDateTimeString(),
    dueDate: isDateString(task.dueDate) ? task.dueDate : null,
    urgency: isUrgency(task.urgency) ? task.urgency : "calm",
  };
}

function readStoredTasks(key: string): Task[] | null {
  const data = localStorage.getItem(key);

  if (!data) {
    return null;
  }

  const parsed: unknown = JSON.parse(data);

  if (!Array.isArray(parsed)) {
    return null;
  }

  const tasks = parsed
    .map(normalizeTask)
    .filter((task): task is Task => task !== null);

  return tasks;
}

export function loadTasks(): Task[] {
  try {
    const currentTasks = readStoredTasks(STORAGE_KEY);

    if (currentTasks) {
      return currentTasks;
    }

    const legacyTasks = readStoredTasks(LEGACY_STORAGE_KEY);

    if (legacyTasks) {
      saveTasks(legacyTasks);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      return legacyTasks;
    }

    return SEED_TASKS;
  } catch {
    return SEED_TASKS;
  }
}

export function saveTasks(tasks: Task[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // localStorage can throw in private browsing or when quota is exceeded
  }
}
