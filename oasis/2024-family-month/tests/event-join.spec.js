// @ts-check
const { test, expect } = require('@playwright/test');
import testData from '../playwright/.auth/user.json';

// 1. 만약 아래 줄에서 에러 날 시 node check-user-json.js 실행하여 .auth폴더와 user.json 체크 해보기
// 2. env에 자기 token 추가하기 또는 npx playwright test auth.setup.js 먼저 실행하여 user.json에 token 생성 확인 후, npx playwright test 실행
const accessToken = testData ? testData.origins[0].localStorage[2].value : process.env.ACCESS_TOKEN;

// 로그인 유도 팝업
test('login-check', async ({ page }) => {
  await page.goto(`${process.env.EVENT_URL}`); // event url 진입 (토큰 없이)
  await expect(page.getByRole('paragraph')).toContainText('로그인 후 참여가능합니다');
  await page.getByRole('button', { name: '확인' }).click();
  await expect(page.url()).toContain(`https://esavezone.co.kr/`);
});

//공유하기 확인
test('share-check', async ({ page }) => {
  await page.goto(`${process.env.EVENT_URL}?token=${accessToken}`); // event url 진입
  await page.locator('label').getByRole('img').click(); //공유하기 클릭

  // 카카오
  const kakaoPopupPromise = page.waitForEvent('popup');
  await page.locator('#kakao').click();
  const kakaoPopup = await kakaoPopupPromise;
  await expect(kakaoPopup.getByRole('heading')).toContainText('Kakao');
  await kakaoPopup.close();

  // URL 복사
  await page.locator('#linkCopy').click();
  page.once('dialog', async dialog => {
    await console.log(`Dialog message: ${dialog.message()}`);
    await dialog.dismiss().catch(() => {});
  });
  const clipboardText = await page.evaluate("navigator.clipboard.readText()");
  await expect(clipboardText).toContain(`${process.env.SHARE_URL}`);

  await page.locator('label').getByRole('img').click();
});

// 약관동의 유도 팝업
test('pr-check', async ({ page }) => {
  await page.goto(`${process.env.EVENT_URL}?token=${accessToken}`); // event url 진입

  // 둘 다 미동의
  await page.locator('#application-button').click(); // 응모하기 클릭
  await page.locator('#event-enter-btn').click(); // 응모하기 클릭
  await expect(page.getByRole('paragraph')).toContainText('이벤트 약관에 동의를 해주셔야이벤트 참여가 가능합니다');
  await page.getByRole('button', { name: '확인' }).click(); // 약관동의 유도 팝업

  // pr1만 동의
  await page.locator('#pr-box-1').getByRole('img').click(); // 약관1 체크박스 클릭
  await page.locator('#event-enter-btn').click(); // 응모하기 클릭
  await expect(page.getByRole('paragraph')).toContainText('이벤트 약관에 동의를 해주셔야이벤트 참여가 가능합니다');
  await page.getByRole('button', { name: '확인' }).click(); // 약관동의 유도 팝업

  // pr2만 동의
  await page.locator('#pr-box-1').getByRole('img').click(); // 약관1 체크박스 클릭
  await page.locator('#pr-box-2').getByRole('img').click(); // 약관2 체크박스 클릭
  await page.locator('#event-enter-btn').click(); // 응모하기 클릭
  await expect(page.getByRole('paragraph')).toContainText('이벤트 약관에 동의를 해주셔야이벤트 참여가 가능합니다');
  await page.getByRole('button', { name: '확인' }).click(); // 약관동의 유도 팝업
});

// 정상참여 케이스
test('event-join', async ({ page }) => {
  await page.goto(`${process.env.EVENT_URL}?token=${accessToken}`); // event url 진입
  await page.locator('#application-button').click(); // 응모하기 클릭
  await page.locator('#pr-box-1').getByRole('img').click(); // 약관1 체크박스 클릭
  await page.locator('#pr-box-2').getByRole('img').click(); // 약관2 체크박스 클릭
  await page.locator('#event-enter-btn').click(); // 응모하기 클릭
  await page.locator('#popup-confirm-btn').click(); // 응모완료 팝업 > 확인 클릭
  await expect(page.locator('#application-button.disabled')).toBeVisible(); // 응모하기 버튼 비활성화 확인
});

test('admin-check', async ({ page }) => {
  await page.goto(`${process.env.EVENT_ADMIN_LOGIN_URL}`);
  await page.getByPlaceholder('이메일').fill(`${process.env.EVENT_ADMIN_ID}`);
  await page.getByPlaceholder('비밀번호').fill(`${process.env.EVENT_ADMIN_PW}`);
  await page.getByRole('button', { name: '로그인' }).click();
  await expect(page.getByRole('heading', { name: '이벤트 관리자' })).toBeVisible(); // 이벤트 관리자 정상 진입 체크

  await page.getByRole('link', { name: '경품응모이벤트' }).click();
  await page.locator('#eventInfo').click();
  await page.getByText('5월 경품 응모 이벤트').click();
  await page.getByRole('button', { name: '검색' }).click();
  
  await expect.soft(page.getByRole('cell', { name: `${process.env.SAVEZONE_USERNAME}`, exact: true }).first()).toBeVisible();
});
