import { expect, test } from "@playwright/test";

test("opens The Room and answers a question", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("THE ROOM")).toBeVisible();
  await expect(page.getByText("Ask me something.")).toBeVisible();
  const input = page.getByPlaceholder("Ask something. The room will decide how to answer.");
  await input.fill("Tell me about books");
  await page.getByRole("button", { name: "Send question" }).click();
  await expect(page.getByText("Books are rooms you carry")).toBeVisible();
  await expect(page.getByText("The Curator")).toBeVisible();
});
