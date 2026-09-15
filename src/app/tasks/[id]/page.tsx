import type { Metadata } from "next";
import { BackToTasksLink } from "@/components/back-to-tasks-link";
import { PageShell } from "@/components/page-shell";
import { TaskEditor } from "@/components/task-editor";

export const metadata: Metadata = {
  title: "Edit task",
};

export default async function TaskPage({
  params,
}: PageProps<"/tasks/[id]">) {
  const { id } = await params;

  return (
    <PageShell>
      <header className="flex items-center gap-3">
        <BackToTasksLink />
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Edit task
        </h1>
      </header>
      <TaskEditor taskId={id} />
    </PageShell>
  );
}
