import { Skeleton } from "@/components/ui/skeleton";

export function QuestionFormShell() {
  return (
    <section className="glass-panel rounded-[28px] p-6">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-fg">提问 · Focus</h2>
          <p className="text-sm text-muted-foreground">
            描述你想揭示的问题，系统会建议更聚焦的问法。
          </p>
        </div>
        <span className="veil-capsule">Step 1</span>
      </header>
      <div className="mt-6 space-y-4">
        <Skeleton className="h-12 w-full rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-10 rounded-2xl" />
          <Skeleton className="h-10 rounded-2xl" />
          <Skeleton className="h-10 rounded-2xl sm:col-span-2" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
    </section>
  );
}
