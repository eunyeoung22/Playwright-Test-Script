import { test as setup, expect } from '@playwright/test';

const authFile = './playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
    await page.goto(`${process.env.LOGIN_URL}`);
    await page.locator('#userId').fill(`${process.env.SAVEZONE_ID}`);
    await page.locator('#password').fill(`${process.env.SAVEZONE_PW}`);
    await page.getByRole('main').getByRole('button', { name: '로그인' }).click();

    await expect(page.getByText(`${process.env.SAVEZONE_USERNAME}님`)).toBeVisible();
    await expect(page.locator('#app')).toContainText(`${process.env.SAVEZONE_USERNAME}님`);

    await page.context().storageState({ path: authFile });
});

