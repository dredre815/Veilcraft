import { Skeleton } from "@/components/ui/skeleton";

export function ReadingPanelShell() {
  return (
    <section className="glass-panel rounded-[32px] p-6">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-fg">解读 · Reading</h2>
          <p className="text-sm text-muted-foreground">
            流式呈现 Overview、主题标签、牌位摘要、行动建议与风险提示。
          </p>
        </div>
        <span className="veil-capsule">Step 4</span>
      </header>
      <div className="mt-6 space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-8 rounded-full" />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border p-4"
              style={{ background: "color-mix(in srgb, var(--surface) 60%, transparent)" }}
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="mt-3 h-16 w-full rounded-2xl" />
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <Skeleton className="h-10 rounded-xl" />
                <Skeleton className="h-10 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-14 rounded-2xl" />
          <Skeleton className="h-14 rounded-2xl" />
        </div>
        <Skeleton className="h-6 w-40 rounded-full" />
      </div>
    </section>
  );
}
