import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { VeilBackground } from "@/components/veil-background";
import { DrawCanvas } from "./components/draw-canvas";
import { QuestionForm } from "./components/question-form";
import { ReadingPanel } from "./components/reading-panel";
import { SpreadPicker } from "./components/spread-picker";

export default function ReadPage() {
  return (
    <div className="relative isolate">
      <VeilBackground className="-z-10" />
      <main className="container flex min-h-[calc(100vh-4rem)] flex-col gap-12 py-16 lg:py-20">
        <header className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Button asChild variant="soft" size="sm" className="w-fit">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
                返回首页
              </Link>
            </Button>
            <span className="veil-capsule">体验流程 · Prototype</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-tight text-fg md:text-5xl">
              一次完整的 Veilcraft 占卜旅程
            </h1>
            <p className="max-w-3xl text-base text-muted-foreground md:text-lg">
              从问题到证据驱动的 AI
              解读，每一步都有骨架状态与动效预算。当前为交互壳层，占位未来接入真实
              API、状态管理与流式推理。
            </p>
          </div>
        </header>
        <div className="grid gap-10 lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[380px_minmax(0,1fr)]">
          <div className="space-y-6">
            <QuestionForm />
            <SpreadPicker />
          </div>
          <div className="space-y-6">
            <DrawCanvas />
            <ReadingPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
