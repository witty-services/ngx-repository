import {Page} from './page';

describe('Page', () => {

  it('should map a page to another page with additional informations', () => {
    const originalPage: Page<number> = new Page<number>([1, 2, 3]);
    originalPage.totalItems = 3;
    originalPage.itemsPerPage = 2;
    originalPage.currentPage = 1;

    const newPage: Page<number> = originalPage.map((value: number) => value * 2);
    expect(newPage[0]).toEqual(2);
    expect(newPage[1]).toEqual(4);
    expect(newPage[2]).toEqual(6);
    expect(newPage.totalItems).toEqual(3);
    expect(newPage.itemsPerPage).toEqual(2);
    expect(newPage.currentPage).toEqual(1);
  });

  it('should build new Page', () => {
    const page: Page<number> = Page.build([1, 2, 3]);

    expect(page.length).toBe(3);
    expect(page.itemsPerPage).toBe(3);
    expect(page.currentPage).toBe(0);
    expect(page.totalItems).toBe(3);
  });

  it('should build new Page with args', () => {
    const page: Page<number> = Page.build([1, 2, 3], {
      totalItems: 4,
      itemsPerPage: 5,
      currentPage: 6
    });

    expect(page.length).toBe(3);
    expect(page.itemsPerPage).toBe(5);
    expect(page.currentPage).toBe(6);
    expect(page.totalItems).toBe(4);
  });
});
