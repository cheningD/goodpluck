import { expect, test } from "@playwright/test";

test.describe("New Cart", () => {
  test("should display a zip input on creation", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByTestId("cart-btn").click();
    await page.waitForTimeout(400);
    await expect(page.getByTestId("zip-input")).toBeVisible();
    await expect(page.getByTestId("zip-input")).toBeFocused();
  });
});
