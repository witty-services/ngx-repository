export class Page<T> extends Array<T> {

  public currentPage: number;

  public itemsPerPage: number;

  public totalItems: number;

  public constructor(args?: any) {
    if (Array.isArray(args)) {
      super(...args);
    } else {
      super(args);
    }

    Object.setPrototypeOf(this, Page.prototype);
  }

  public static build<T>(values: T[], metadata: Partial<Page<T>> = null): Page<T> {
    if (metadata) {
      return Object.assign(new Page<T>(values), metadata);
    }

    return Object.assign(new Page<T>(values), {
      itemPerPage: values.length,
      currentPage: 0,
      totalItems: values.length,
    });
  }

  public map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): Page<U> {
    const newPage: Page<U> = new Page(super.map<U>(callbackfn, thisArg));

    newPage.currentPage = this.currentPage;
    newPage.itemsPerPage = this.itemsPerPage;
    newPage.totalItems = this.totalItems;

    return newPage;
  }
}
