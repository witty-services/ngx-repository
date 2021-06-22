import {InternalEvent} from '@witty-services/ngx-repository';

export class AfterFirebaseFindByIdEvent<T, K> implements InternalEvent {

  public id: K;

  public query: any;

  public data: T;

  public constructor(data: Partial<AfterFirebaseFindByIdEvent<T, K>>) {
    Object.assign(this, data);
  }
}
