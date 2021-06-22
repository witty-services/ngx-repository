import {getIdFromObject} from '../util';

export class Id {

  public readonly value: any;

  public constructor(private readonly body: any,
                     private readonly query: any) {
    this.value = this.getId();
  }

  private getId(): any {
    return getIdFromObject(this.query) || getIdFromObject(this.body) || null;
  }
}
