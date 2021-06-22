export class BeforeNormalizeEvent {

  public body: any;

  public constructor(data: Partial<BeforeNormalizeEvent> = {}) {
    Object.assign(this, data);
  }
}
