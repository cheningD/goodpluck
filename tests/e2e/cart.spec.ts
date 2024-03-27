import { expect, test } from "@playwright/test";

test.describe("New Cart", () => {
  test("should display a zip input on creation and show an error message for unsupported zip codes", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByTestId("cart-btn").click();
    await page.waitForTimeout(400);
    await expect(page.getByTestId("zip-input")).toBeVisible();
    await expect(page.getByTestId("zip-input")).toBeFocused();

    // Input an invalid zip
    await page.getByTestId("zip-input").fill("10120");
    await page.getByTestId("zip-submit-btn").click();
    await expect(
      page.getByText("Sorry, we don't serve 10120 yet!"),
    ).toBeVisible();

    // Try a new Zip
    await page.getByTestId("try-different-zip").click();
    await expect(page.getByTestId("zip-input")).toBeVisible();
    await page.getByTestId("zip-input").fill("48206");
    await page.getByTestId("zip-submit-btn").click();
    await expect(page.getByText("Add items to your basket!")).toBeVisible();
    //
  });
});

test.describe("Add to Cart", () => {
  test("should redirect to ", async ({ page }) => {
    // Click add on a random item
    await page.goto("/market/produce");
    await page.waitForLoadState("networkidle");
    await page.getByTestId("add-to-cart").first().click();

    // Expect the cart flyout to open and ask user for zip
    await expect(page.getByTestId("zip-input")).toBeVisible();
    await expect(page.getByTestId("zip-input")).toBeFocused();
  });
});
