import { expect, test } from "@playwright/test";

test("opens The Eighth Door experience", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("You are late.")).toBeVisible();
  await page.getByRole("button", { name: "ENTER" }).click();
  await expect(page.getByText("There are seven doors.")).toBeVisible();
  await expect(page.getByRole("button", { name: /Choose door 1/ })).toBeVisible();
});
