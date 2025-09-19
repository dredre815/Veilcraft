import Link from "next/link";
import { ArrowRight, LineChart, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { VeilBackground } from "@/components/veil-background";

const highlights = [
  {
    title: "确定性抽牌",
    description: "CSPRNG Seed 洗牌，可复盘可分享。",
  },
  {
    title: "证据驱动",
    description: "AI 输出严格遵循 JSON Schema，并附引用。",
  },
  {
    title: "实时流式",
    description: "Edge 推理 1.2s 呈现 Overview，逐块解读。",
  },
];

const recentReadings = [
  {
    category: "情感",
    prompt: "我与伴侣未来三个月的相处会如何演变？",
    spread: "极速三张牌",
    sentiment: "务实",
  },
  {
    category: "事业",
    prompt: "这个新项目值得投入全部资源吗？",
    spread: "凯尔特十字",
    sentiment: "克制",
  },
];

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-20">
        <div className="absolute left-1/2 top-[-280px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-aurora opacity-25 blur-[120px]" />
        <div className="absolute right-[-160px] top-1/3 h-[360px] w-[360px] rounded-full bg-aurora opacity-10 blur-[140px]" />
      </div>
      <VeilBackground className="-z-10" />
      <main className="container flex min-h-[calc(100vh-4rem)] flex-col justify-center gap-20 py-24">
        <section className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <span className="veil-capsule w-fit">幕术 · Evidence-led Tarot</span>
              <div className="space-y-4">
                <h1 className="text-4xl leading-tight text-fg md:text-5xl lg:text-6xl">
                  幕起。占卜，不再含糊。
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  Veilcraft
                  通过确定性抽牌、结构化解读与可追溯证据，将塔罗从灵感转化为可行动的洞察。漂亮的体验，严谨的输出。
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg">
                  <Link href="/read">
                    开始揭幕
                    <ArrowRight className="ml-3 h-5 w-5" aria-hidden />
                  </Link>
                </Button>
                <Button variant="soft" size="lg" type="button" disabled>
                  浏览牌阵蓝图
                </Button>
              </div>
            </div>
            <dl className="grid gap-6 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="glass-panel flex h-full flex-col justify-between gap-2 rounded-3xl p-6"
                >
                  <dt className="text-sm font-semibold text-fg">{item.title}</dt>
                  <dd className="text-sm text-muted-foreground">{item.description}</dd>
                </div>
              ))}
            </dl>
          </div>
          <aside className="glass-panel relative overflow-hidden rounded-[32px] p-8">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(124,92,255,0.22),_transparent_65%)]" />
            <header className="mb-6 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" aria-hidden />
              <div>
                <p className="text-sm font-medium text-muted-foreground">最近公开占卜案例</p>
                <p className="text-lg font-semibold text-fg">可复盘 Seed 链接</p>
              </div>
            </header>
            <div className="space-y-6">
              {recentReadings.map((reading, index) => (
                <div
                  key={`${reading.category}-${index}`}
                  className="rounded-2xl border border-border p-5 shadow-glass"
                  style={{ background: "color-mix(in srgb, var(--surface) 70%, transparent)" }}
                >
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.32em] text-muted-foreground">
                    <span>{reading.category}</span>
                    <span>{reading.spread}</span>
                  </div>
                  <p className="mt-3 text-sm text-fg">{reading.prompt}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
                      Seed 可复盘
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <LineChart className="h-4 w-4 text-primary" aria-hidden />
                      语气 · {reading.sentiment}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
