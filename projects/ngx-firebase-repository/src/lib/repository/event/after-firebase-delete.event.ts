import {InternalEvent} from '@witty-services/ngx-repository';

export class AfterFirebaseDeleteEvent<T, K> implements InternalEvent {

  public object: T;

  public query: any;

  public data: K;

  public constructor(data: Partial<AfterFirebaseDeleteEvent<T, K>>) {
    Object.assign(this, data);
  }
}
