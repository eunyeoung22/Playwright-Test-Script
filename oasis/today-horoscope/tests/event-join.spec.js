// @ts-check
const { test, expect } = require('@playwright/test');
import testData from '../playwright/.auth/user.json';

// 1. 만약 아래 줄에서 에러 날 시 node check-user-json.js 실행하여 .auth폴더와 user.json 체크 해보기
// 2. env에 자기 token 추가하기 또는 npx playwright test auth.setup.js 먼저 실행하여 user.json에 token 생성 확인 후, npx playwright test 실행
const accessToken = testData ? testData.origins[0].localStorage[2].value : process.env.ACCESS_TOKEN;

// 정상 참여 케이스
test('event-join', async ({ page }) => {
  await page.goto(`${process.env.EVENT_URL}?token=${accessToken}`); // event url 진입

  const marketing = await page.locator('#marketing-agree');
  const terms = await page.locator('#terms-wrapper');
  const marketing_style = await marketing.getAttribute('style');
  const terms_style = await terms.getAttribute('style');

  // 마케팅 동의 안했으면 마케팅 토글 클릭
  if (marketing_style !== 'display: none;') {
    await page.locator('#agree-switch').click();
  }
  
  // 약관 동의 안했으면 체크박스 2개 클릭
  if (terms_style !== 'display: none;') {
    await page.locator('.cb').first().click();
    await page.locator('div:nth-child(2) > .terms-title > .cb').click();
  }

  await page.locator('#event-btn').click(); // 이벤트 참여하기 클릭
  await page.getByTestId('QUOTES').click(); // 행운지수 클릭
  await expect(page.locator('#cont-text-title')).toContainText('행운 지수'); // 행운지수 타이틀 확인
  
});

test('admin-check', async ({ page }) => {
  await page.goto(`${process.env.EVENT_ADMIN_LOGIN_URL}`);
  await page.getByPlaceholder('이메일').fill(`${process.env.EVENT_ADMIN_ID}`);
  await page.getByPlaceholder('비밀번호').fill(`${process.env.EVENT_ADMIN_PW}`);
  await page.getByRole('button', { name: '로그인' }).click();
  await expect(page.getByRole('heading', { name: '이벤트 관리자' })).toBeVisible(); // 이벤트 관리자 정상 진입 체크

  await page.getByText('출석이벤트 (V1)').click();
  await page.getByRole('link', { name: '참여이력' }).click();
  await page.locator('#luckEventInfo').click();
  await page.getByText('세이브존 운세 이벤트').click();
  await page.getByRole('button', { name: '검색' }).click();

  //await expect(page.getByRole('cell', { name: `${process.env.SAVEZONE_USERNAME}`, exact: true }).first()).toBeVisible();
  await expect.soft(page.getByRole('cell', { name: `${process.env.SAVEZONE_USERNAME}`, exact: true }).first()).toBeVisible();
});