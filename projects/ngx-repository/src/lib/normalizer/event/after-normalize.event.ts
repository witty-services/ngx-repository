export class AfterNormalizeEvent {

  public body: any;

  public data: any;

  public constructor(data: Partial<AfterNormalizeEvent> = {}) {
    Object.assign(this, data);
  }
}
