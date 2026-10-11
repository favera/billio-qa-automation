import { expect, test as base, type Page } from '@playwright/test';
import type { DemoRole } from '../types/demo-role';

const roleOptionLabels: Record<DemoRole, string> = {
  Bookkeeper: 'Avery Chen (Bookkeeper)',
  'AP Manager': 'Marcus Rivera (AP Manager)',
  Controller: 'Priya Shah (Controller)',
};

/**
 * Selects one of the roles exposed by Billio's demo switcher.
 * This selects demo UI state; it does not authenticate a user or verify
 * server-side authorization.
 */
export async function selectDemoRole(
  page: Page,
  role: DemoRole,
): Promise<void> {
  const switcher = page.getByRole('combobox', { name: 'Viewing as' });
  const optionLabel = roleOptionLabels[role];

  await expect(switcher).toBeVisible();
  await switcher.selectOption({ label: optionLabel });
  await expect(switcher.locator('option:checked')).toHaveText(optionLabel);
}

type RoleFixtures = {
  selectDemoRole: (role: DemoRole) => Promise<void>;
};

export const test = base.extend<RoleFixtures>({
  selectDemoRole: async ({ page }, use) => {
    await use((role) => selectDemoRole(page, role));
  },
});

export { expect };
