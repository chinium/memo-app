import { test, expect } from '@playwright/test';

test.describe('새 메모 작성', () => {

  // 각 테스트가 격리된 localStorage를 갖도록 설정합니다.
  test.use({ storageState: undefined });

  test('사용자는 새 메모를 작성할 수 있다', async ({ page }) => {
    await page.goto('/');

    // 초기 상태에서는 메모가 없어야 합니다.
    const initialMemoCount = await page.locator('.memo-list > li').count();
    expect(initialMemoCount).toBe(0);

    // 1. '새 메모' 버튼을 클릭합니다.
    await page.getByRole('button', { name: '새 메모' }).click();

    // 2. '새 메모 작성' 폼이 나타나는지 확인합니다.
    await expect(page.getByRole('heading', { name: '새 메모 작성' })).toBeVisible();

    // 3. '제목' 입력란에 메모 제목을 입력합니다.
    const memoTitle = 'Playwright 최종 안정화 테스트';
    await page.getByPlaceholder('메모 제목을 입력하세요').fill(memoTitle);

    // 4. '카테고리' 드롭다운에서 카테고리를 선택합니다.
    await page.getByLabel('카테고리').selectOption('업무');

    // 5. '내용' 입력란에 마크다운 형식으로 메모 내용을 입력합니다.
    await page.locator('.w-md-editor-text-input').fill('# 최종 안정화 테스트 내용입니다.');

    // 6. '태그' 입력란에 태그를 추가합니다.
    await page.getByPlaceholder('태그를 입력하고 Enter를 누르세요').fill('e2e-stable');
    await page.keyboard.press('Enter');
    
    // 7. '저장하기' 버튼을 클릭합니다.
    await page.getByRole('button', { name: '저장하기' }).click();

    // 8. 메모 목록에 새로 추가된 메모가 표시되는지 확인합니다.
    await expect(page.getByRole('listitem').filter({ hasText: memoTitle })).toBeVisible({ timeout: 10000 });

    // 9. 총 메모 개수가 1 증가했는지 확인합니다.
    await expect(page.locator('.memo-list > li')).toHaveCount(1);
  });
});
