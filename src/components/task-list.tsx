"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ClearFiltersButton } from "@/components/clear-filters-button";
import { FilterToggleButton } from "@/components/filter-toggle-button";
import { SortDirectionToggle } from "@/components/sort-direction-toggle";
import { TaskFilters } from "@/components/task-filters";
import { TaskItem } from "@/components/task-item";
import {
  filterTasks,
  sortTasks,
  type DateFilterMode,
  type SortDirection,
  type SortOption,
} from "@/lib/task-filters";
import { createTask, loadTasks, saveTasks, type Task } from "@/lib/tasks";

export function TaskList() {
  const pathname = usePathname();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date-start");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [dateMode, setDateMode] = useState<DateFilterMode>("from");
  const [createdDate, setCreatedDate] = useState("");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setTasks(loadTasks());
    setIsReady(true);
  }, [pathname]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    saveTasks(tasks);
  }, [isReady, tasks]);

  const remainingCount = tasks.reduce(
    (count, task) => (task.completed ? count : count + 1),
    0,
  );
  const visibleTasks = sortTasks(
    filterTasks(tasks, query, dateMode, createdDate),
    sortBy,
    sortDirection,
  );
  const hasActiveFilters = query.trim().length > 0 || createdDate.length > 0;

  const addTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    setTasks((currentTasks) => [createTask(trimmedTitle), ...currentTasks]);
    setTitle("");
  };

  const toggleTask = useCallback((id: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  }, []);

  return (
    <section className="flex w-full flex-col gap-6">
      <form onSubmit={addTask} className="flex gap-2">
        <label htmlFor="new-task" className="sr-only">
          New task
        </label>
        <input
          id="new-task"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Add a task"
          autoComplete="off"
          className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-surface px-4 text-sm text-foreground outline-none ring-ring placeholder:text-muted focus:ring-2"
        />
        <button
          type="submit"
          className="theme-action h-11 shrink-0 rounded-xl px-4 text-sm font-medium transition-colors"
        >
          Add
        </button>
        {isFiltersOpen || hasActiveFilters ? (
          <ClearFiltersButton
            disabled={!hasActiveFilters}
            onClear={() => {
              setQuery("");
              setCreatedDate("");
              setDateMode("from");
            }}
          />
        ) : null}
        <FilterToggleButton
          isOpen={isFiltersOpen}
          onToggle={() => setIsFiltersOpen((isOpen) => !isOpen)}
        />
      </form>

      {isReady ? (
        tasks.length > 0 ? (
          <>
            {isFiltersOpen ? (
              <TaskFilters
                query={query}
                sortBy={sortBy}
                dateMode={dateMode}
                createdDate={createdDate}
                autoFocus
                onQueryChange={setQuery}
                onSortChange={setSortBy}
                onDateModeChange={setDateMode}
                onCreatedDateChange={setCreatedDate}
              />
            ) : null}
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted">
                {hasActiveFilters
                  ? `${visibleTasks.length} matching`
                  : `${remainingCount} remaining`}
              </p>
              <SortDirectionToggle
                direction={sortDirection}
                onToggle={() =>
                  setSortDirection((current) =>
                    current === "asc" ? "desc" : "asc",
                  )
                }
              />
            </div>
            {visibleTasks.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {visibleTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                  />
                ))}
              </ul>
            ) : (
              <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted">
                No tasks match those filters.
              </p>
            )}
          </>
        ) : (
          <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted">
            No tasks yet. Add one to get started.
          </p>
        )
      ) : (
        <p className="text-sm text-muted">Loading tasks…</p>
      )}
    </section>
  );
}
