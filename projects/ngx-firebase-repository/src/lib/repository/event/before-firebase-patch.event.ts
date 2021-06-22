import {InternalEvent} from '@witty-services/ngx-repository';

export class BeforeFirebasePatchEvent<T> implements InternalEvent {

  public object: T;

  public query: any;

  public constructor(data: Partial<BeforeFirebasePatchEvent<T>>) {
    Object.assign(this, data);
  }
}
