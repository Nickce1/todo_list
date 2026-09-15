"use client";

import { FormEvent, useState } from "react";
import { ClearFiltersButton } from "@/components/clear-filters-button";
import { FilterToggleButton } from "@/components/filter-toggle-button";
import { SortDirectionToggle } from "@/components/sort-direction-toggle";
import { TaskFilters } from "@/components/task-filters";
import { TaskItem } from "@/components/task-item";
import { filterTasks, sortTasks } from "@/lib/task-filters";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectCreatedDate,
  selectDateMode,
  selectFilterQuery,
  selectFiltersOpen,
  selectSortBy,
  selectSortDirection,
} from "@/store/filters/selectors";
import {
  clearFilters,
  setCreatedDate,
  setDateMode,
  setQuery,
  setSortBy,
  toggleFiltersOpen,
  toggleSortDirection,
} from "@/store/filters/slice";
import { selectTasks, selectTasksStatus } from "@/store/tasks/selectors";
import {
  addTaskRequested,
  deleteTaskRequested,
  toggleTaskRequested,
} from "@/store/tasks/slice";

export function TaskList() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasks);
  const status = useAppSelector(selectTasksStatus);
  const query = useAppSelector(selectFilterQuery);
  const sortBy = useAppSelector(selectSortBy);
  const sortDirection = useAppSelector(selectSortDirection);
  const dateMode = useAppSelector(selectDateMode);
  const createdDate = useAppSelector(selectCreatedDate);
  const isFiltersOpen = useAppSelector(selectFiltersOpen);
  const [title, setTitle] = useState("");

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
  const isReady = status === "ready" || status === "failed";

  const addTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    dispatch(addTaskRequested(trimmedTitle));
    setTitle("");
  };

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
            onClear={() => dispatch(clearFilters())}
          />
        ) : null}
        <FilterToggleButton
          isOpen={isFiltersOpen}
          onToggle={() => dispatch(toggleFiltersOpen())}
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
                onQueryChange={(value) => dispatch(setQuery(value))}
                onSortChange={(value) => dispatch(setSortBy(value))}
                onDateModeChange={(value) => dispatch(setDateMode(value))}
                onCreatedDateChange={(value) => dispatch(setCreatedDate(value))}
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
                onToggle={() => dispatch(toggleSortDirection())}
              />
            </div>
            {visibleTasks.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {visibleTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={(id) => dispatch(toggleTaskRequested(id))}
                    onDelete={(id) => dispatch(deleteTaskRequested(id))}
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
