import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="flex flex-1 justify-center bg-page px-4 py-12">
      <main className="flex w-full max-w-xl flex-col gap-8">{children}</main>
    </div>
  );
}
