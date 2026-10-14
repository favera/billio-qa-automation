import { expect, test } from '../../fixtures/test';

const roleOptionLabels = [
  'Avery Chen (Bookkeeper)',
  'Marcus Rivera (AP Manager)',
  'Priya Shah (Controller)',
];

test.describe('role-dependent UI behavior', () => {
  test('[RBT-001] exposes the documented demo role options', async ({
    page,
  }) => {
    await page.goto('/');

    const roleSwitcher = page.getByRole('combobox', { name: 'Viewing as' });
    await expect(roleSwitcher.locator('option')).toHaveText(roleOptionLabels);
  });

  test('[RBT-001] shows process-due control to AP Manager, not Bookkeeper', async ({
    page,
    selectDemoRole,
  }) => {
    await page.goto('/bills');
    const runNowButton = page.getByRole('button', {
      name: 'Run now',
      exact: true,
    });

    await selectDemoRole('Bookkeeper');
    await expect(runNowButton).toBeHidden();

    await selectDemoRole('AP Manager');
    await expect(runNowButton).toBeVisible();
  });

  test('[VEN-001] shows vendor management control only to Controller', async ({
    page,
    selectDemoRole,
  }) => {
    await page.goto('/vendors');
    const newVendorLink = page.getByRole('link', {
      name: 'New vendor',
      exact: true,
    });

    await selectDemoRole('Bookkeeper');
    await expect(newVendorLink).toBeHidden();

    await selectDemoRole('AP Manager');
    await expect(newVendorLink).toBeHidden();

    await selectDemoRole('Controller');
    await expect(newVendorLink).toBeVisible();
  });
});
