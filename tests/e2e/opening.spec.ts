import { expect, test } from "@playwright/test";

test("opens The Room and answers a question", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("THE ROOM")).toBeVisible();
  await expect(page.getByText("Ask me something.")).toBeVisible();
  await page.getByPlaceholder("Ask something. The room will decide how to answer.").fill("Tell me something strange");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.getByText("I found something in the library")).toBeVisible();
});
