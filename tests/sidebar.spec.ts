import { test, expect } from "@playwright/test";

test.describe("Sidebar desktop Tests", () => {
  test("should load first child category when a top level category is selected i.e Produce", async ({
    page,
  }) => {
    await page.goto("/market/produce");
    await expect(page.getByTestId("desktop-sidebar")).toBeVisible();
    const hrefValue = await page
      .getByTestId("top-level-category")
      .getAttribute("href");
    expect(hrefValue).toBe("/market/produce");
  });
});
