import {InternalEvent} from '@witty-services/ngx-repository';

export class AfterFirebaseFindAllEvent<T> implements InternalEvent {

  public query: any;

  public data: T;

  public constructor(data: Partial<AfterFirebaseFindAllEvent<T>>) {
    Object.assign(this, data);
  }
}
