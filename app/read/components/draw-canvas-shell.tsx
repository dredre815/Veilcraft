import { Skeleton } from "@/components/ui/skeleton";

export function DrawCanvasShell() {
  return (
    <section className="glass-panel rounded-[32px] p-6">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-fg">抽牌 · Draw</h2>
          <p className="text-sm text-muted-foreground">
            Fisher–Yates 确定性洗牌，扇形展开，逐张翻转。
          </p>
        </div>
        <span className="veil-capsule">Step 3</span>
      </header>
      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div
          className="relative flex h-[320px] items-center justify-center overflow-hidden rounded-3xl border border-border"
          style={{ background: "color-mix(in srgb, var(--surface) 60%, transparent)" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.25),_transparent_70%)]" />
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-24 w-16 rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-10 w-full rounded-2xl" />
          <Skeleton className="h-10 w-full rounded-2xl" />
          <Skeleton className="h-10 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
        </div>
      </div>
    </section>
  );
}
