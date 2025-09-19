import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const THREE_CARD_REVEALS = 3;

const SAMPLE_QUESTION = "在即将到来的业务重组中，我该如何定位自己的优势并获得跨团队的支持？";

test.describe("/read tarot flow", () => {
  test("three-card happy path generates a structured reading without accessibility regressions", async ({
    page,
  }) => {
    await page.goto("/read");

    await expect(
      page.getByRole("heading", { name: "一次完整的 Veilcraft 占卜旅程" }),
    ).toBeVisible();

    await page.getByLabel("你的核心问题").fill(SAMPLE_QUESTION);

    await page.getByRole("button", { name: "锁定问题" }).click();
    await expect(page.getByText("已锁定问题，继续选择牌阵。")).toBeVisible();

    const shuffleButton = page.getByRole("button", { name: "开始洗牌" });
    await expect(shuffleButton).toBeEnabled();
    await shuffleButton.click();

    const nextButton = page.getByRole("button", { name: "翻开下一张" });
    await expect(nextButton).toBeEnabled({ timeout: 8_000 });

    for (let index = 0; index < THREE_CARD_REVEALS; index += 1) {
      await expect(nextButton).toBeEnabled();
      await nextButton.click();
    }

    await expect(page.getByText("解读已生成")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("可执行建议")).toBeVisible();
    await expect(page.getByText("风险提醒")).toBeVisible();
    await expect(page.getByText("复盘与分享")).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .include("main")
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
