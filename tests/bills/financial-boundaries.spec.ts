import { expect, test } from '../../fixtures/test';

test('[FIN-002] totals line amounts across the $5,000 approval boundary', async ({
  page,
  selectDemoRole,
}) => {
  await page.goto('/bills/new');
  await selectDemoRole('Bookkeeper');

  const amountInputs = page.getByLabel('Amount (USD)');
  await expect(amountInputs).toHaveCount(1);
  await amountInputs.first().fill('4999.99');

  await page.getByRole('button', { name: 'Add line', exact: true }).click();
  const secondAmount = amountInputs.nth(1);
  const billTotal = page.getByLabel('Bill total');

  await secondAmount.fill('0.01');
  await expect(billTotal).toContainText('$5,000.00');

  await secondAmount.fill('0.02');
  await expect(billTotal).toContainText('$5,000.01');
});
