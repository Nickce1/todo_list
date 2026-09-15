import { PageShell } from "@/components/page-shell";
import { TaskList } from "@/components/task-list";

export default function Home() {
  return (
    <PageShell>
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          todoList
        </h1>
        <p className="text-sm text-muted">
          Keep track of what you need to get done.
        </p>
      </header>
      <TaskList />
    </PageShell>
  );
}
