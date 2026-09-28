import { expect, test } from "@playwright/test";

test("starts Starfall and shows the game HUD", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("STARFALL")).toBeVisible();
  await expect(page.getByText("Catch the light.")).toBeVisible();
  await page.getByRole("button", { name: "START STARFALL" }).click();
  await expect(page.locator("canvas.starfall-canvas")).toBeVisible();
  await expect(page.getByText("SCORE")).toBeVisible();
});
