import {InternalEvent} from '@witty-services/ngx-repository';

export class AfterFirebaseUpdateEvent<T, K> implements InternalEvent {

  public object: T;

  public query: any;

  public data: K;

  public constructor(data: Partial<AfterFirebaseUpdateEvent<T, K>>) {
    Object.assign(this, data);
  }
}
