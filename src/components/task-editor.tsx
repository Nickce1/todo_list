"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BackToTasksLink } from "@/components/back-to-tasks-link";
import {
  formatTaskDate,
  formatTaskDateTime,
  getTaskById,
  isUrgency,
  updateTask,
  URGENCY_LABELS,
  URGENCY_LEVELS,
  type Urgency,
} from "@/lib/tasks";

const fieldClassName =
  "h-11 rounded-xl border border-border bg-surface px-4 text-sm text-foreground outline-none ring-ring focus:ring-2";

type TaskEditorProps = {
  taskId: string;
};

export function TaskEditor({ taskId }: TaskEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [createdAt, setCreatedAt] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [urgency, setUrgency] = useState<Urgency>("calm");
  const [isReady, setIsReady] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const task = getTaskById(taskId);

    if (!task) {
      setNotFound(true);
      setIsReady(true);
      return;
    }

    setTitle(task.title);
    setDescription(task.description);
    setCompleted(task.completed);
    setCreatedAt(task.createdAt);
    setDueDate(task.dueDate ?? "");
    setUrgency(task.urgency);
    setNotFound(false);
    setIsReady(true);
  }, [taskId]);

  const saveTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    const updatedTask = updateTask(taskId, {
      title: trimmedTitle,
      description: description.trim(),
      completed,
      dueDate: dueDate || null,
      urgency,
    });

    if (!updatedTask) {
      setNotFound(true);
      return;
    }

    router.push("/");
  };

  if (!isReady) {
    return <p className="text-sm text-muted">Loading task…</p>;
  }

  if (notFound) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted">This task could not be found.</p>
        <BackToTasksLink />
      </div>
    );
  }

  return (
    <form onSubmit={saveTask} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="task-title" className="text-sm font-medium text-subtle">
          Title
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          autoComplete="off"
          required
          className={fieldClassName}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="task-description" className="text-sm font-medium text-subtle">
          Description
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          maxLength={280}
          placeholder="Add a brief description"
          className="min-h-24 resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none ring-ring placeholder:text-muted focus:ring-2"
        />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-subtle">Creation date</p>
        <p className="text-sm text-muted">{formatTaskDateTime(createdAt)}</p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="task-due-date" className="text-sm font-medium text-subtle">
          Last due date
        </label>
        <input
          id="task-due-date"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          className={fieldClassName}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="task-urgency" className="text-sm font-medium text-subtle">
          Urgency
        </label>
        <select
          id="task-urgency"
          value={urgency}
          onChange={(event) => {
            if (isUrgency(event.target.value)) {
              setUrgency(event.target.value);
            }
          }}
          className={fieldClassName}
        >
          {URGENCY_LEVELS.map((level) => (
            <option key={level} value={level}>
              {URGENCY_LABELS[level]}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-3 text-sm text-foreground">
        <input
          type="checkbox"
          checked={completed}
          onChange={(event) => setCompleted(event.target.checked)}
          className="size-4 rounded border-border accent-accent"
        />
        Mark as completed
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="theme-action h-11 rounded-xl px-4 text-sm font-medium transition-colors"
        >
          Save
        </button>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-xl px-4 text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
