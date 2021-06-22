import {InternalEvent} from '@witty-services/ngx-repository';

export class AfterFirebasePatchEvent<T, K> implements InternalEvent {

  public object: T;

  public query: any;

  public data: K;

  public constructor(data: Partial<AfterFirebasePatchEvent<T, K>>) {
    Object.assign(this, data);
  }
}
