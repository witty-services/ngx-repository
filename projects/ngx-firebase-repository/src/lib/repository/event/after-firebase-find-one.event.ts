import {InternalEvent} from '@witty-services/ngx-repository';

export class AfterFirebaseFindOneEvent<T> implements InternalEvent {

  public query: any;

  public data: T;

  public constructor(data: Partial<AfterFirebaseFindOneEvent<T>>) {
    Object.assign(this, data);
  }
}
