import {InternalEvent} from '@witty-services/ngx-repository';

export class AfterFirebaseCreateEvent<T, K> implements InternalEvent {

  public object: T;

  public query: any;

  public data: K;

  public constructor(data: Partial<AfterFirebaseCreateEvent<T, K>>) {
    Object.assign(this, data);
  }
}
