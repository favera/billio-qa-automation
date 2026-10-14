import { expect, test } from '../../fixtures/test';

test('[STATE-001] displays the seeded pending bill state and activity', async ({
  page,
  selectDemoRole,
}) => {
  await page.goto('/bills');
  await selectDemoRole('Bookkeeper');

  await page.getByRole('link', { name: 'View bill ACME-10501' }).click();

  await expect(
    page.getByText('Pending approval', { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByText(
      'This bill awaits AP Manager approval. Switch to Marcus Rivera (AP Manager) to decide it.',
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.getByText('Created bill', { exact: true })).toBeVisible();
  await expect(
    page.getByText('Submitted for approval', { exact: true }),
  ).toBeVisible();
});
