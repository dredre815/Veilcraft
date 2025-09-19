import { Skeleton } from "@/components/ui/skeleton";

const spreads = [
  { title: "极速三张牌", hint: "过去 · 现在 · 未来" },
  { title: "凯尔特十字", hint: "根因 · 阻碍 · 未来走向" },
];

export function SpreadPickerShell() {
  return (
    <section className="glass-panel rounded-[28px] p-6">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-fg">牌阵 · Spread</h2>
          <p className="text-sm text-muted-foreground">
            选择适配问题深度的牌阵，右侧实时预览布局。
          </p>
        </div>
        <span className="veil-capsule">Step 2</span>
      </header>
      <div className="mt-6 grid gap-4">
        {spreads.map((spread) => (
          <div
            key={spread.title}
            className="rounded-2xl border border-border p-4"
            style={{ background: "color-mix(in srgb, var(--surface) 65%, transparent)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-fg">{spread.title}</p>
                <p className="text-xs text-muted-foreground">{spread.hint}</p>
              </div>
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-16 rounded-2xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
