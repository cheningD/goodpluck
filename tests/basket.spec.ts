import { test, expect } from "@playwright/test";

test.describe("Basket Sidebar Tests", () => {
  test(`When a user attempts to open the basket or edit it without a Zipcode
   on record, trigger the right sidebar to display the Zipcode entry form.`, async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "chromium" || browserName === "webkit",
      "Chromium show toBeVisible as hidden after a long timeout!",
    );
    await page.goto("/");
    await expect(page.getByTestId("top-banner")).toBeVisible();
    await page.getByTestId("top-banner-zip").click();
    await expect(page.getByTestId("basket-sidebar")).toBeVisible();
    await expect(page.getByTestId("basket-tab-zip")).toBeVisible();
  });

  test(`If the Zipcode is not in the service area,
    redirect the user to a waitlist signup page.`, async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "chromium" || browserName === "webkit",
      "Chromium show toBeVisible as hidden after a long timeout!",
    );
    await page.goto("/");
    await expect(page.getByTestId("top-banner")).toBeVisible();
    await page.getByTestId("top-banner-zip").click();
    await expect(page.getByTestId("basket-sidebar")).toBeVisible();
    await expect(page.getByTestId("basket-tab-zip")).toBeVisible();
    await page.getByTestId("user-zip").fill("00000");
    await page.getByTestId("btn-verify-zip").click();
    await page.waitForURL("**/waitlist");
  });

  test(`Post Zipcode submission, the user should be able to add items to their
    basket without any further prompts for the Zipcode.`, async ({
    page,
    browserName,
  }) => {
    test.skip(
      browserName === "chromium" || browserName === "webkit",
      "Chromium show toBeVisible as hidden after a long timeout!",
    );
    await page.goto("/");
    await expect(page.getByTestId("top-banner")).toBeVisible();
    await page.getByTestId("top-banner-zip").click();
    await expect(page.getByTestId("basket-sidebar")).toBeVisible();
    await expect(page.getByTestId("basket-tab-zip")).toBeVisible();
    await page.getByTestId("user-zip").fill("48210");
    await page.getByTestId("btn-verify-zip").click();
    await expect(page.getByTestId("basket-tab-orders")).toBeVisible();
  });
});
