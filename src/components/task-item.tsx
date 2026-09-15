"use client";

import { useState } from "react";
import Link from "next/link";
import type { Task } from "@/lib/tasks";
import { formatTaskDate, formatTaskDateTime } from "@/lib/tasks";
import { UrgencyBadge } from "@/components/urgency-badge";

type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`size-4 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
      aria-hidden="true"
    >
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

const iconButtonClassName =
  "flex size-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-page hover:text-foreground";

function canHover() {
  return window.matchMedia("(hover: hover)").matches;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const description = task.description.trim();
  const showDescription = () => setIsDescriptionOpen(true);
  const hideDescription = () => setIsDescriptionOpen(false);

  return (
    <li className="flex items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3 transition-colors hover:border-border-strong hover:bg-surface-hover">
      <input
        id={`task-${task.id}`}
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Mark ${task.title} as ${task.completed ? "incomplete" : "complete"}`}
        className="mt-1 size-4 shrink-0 rounded border-border accent-accent"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <Link href={`/tasks/${task.id}`} className="min-w-0 flex-1">
            <span
              className={`block text-sm leading-6 ${
                task.completed ? "text-completed line-through" : "text-foreground"
              }`}
            >
              {task.title}
            </span>
            <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
              <span>Created {formatTaskDateTime(task.createdAt)}</span>
              <span aria-hidden="true">·</span>
              <span>
                {task.dueDate
                  ? `Last due ${formatTaskDate(task.dueDate)}`
                  : "No last due date"}
              </span>
            </span>
          </Link>
          <div className="flex shrink-0 items-start gap-1">
            <span className="flex h-8 items-center">
              <UrgencyBadge urgency={task.urgency} />
            </span>
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => onDelete(task.id)}
                aria-label={`Delete ${task.title}`}
                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-500"
              >
                <DeleteIcon />
              </button>
              <button
                type="button"
                aria-expanded={isDescriptionOpen}
                aria-controls={`task-description-${task.id}`}
                aria-label={`Show description for ${task.title}`}
                onPointerEnter={showDescription}
                onPointerLeave={hideDescription}
                onFocus={showDescription}
                onBlur={hideDescription}
                onClick={() => {
                  if (!canHover()) {
                    setIsDescriptionOpen((isOpen) => !isOpen);
                  }
                }}
                className={iconButtonClassName}
              >
                <ChevronIcon isOpen={isDescriptionOpen} />
              </button>
            </div>
          </div>
        </div>
        {isDescriptionOpen ? (
          <p
            id={`task-description-${task.id}`}
            className="mt-2 text-sm leading-6 text-muted"
          >
            {description || "No description yet."}
          </p>
        ) : null}
      </div>
    </li>
  );
}
