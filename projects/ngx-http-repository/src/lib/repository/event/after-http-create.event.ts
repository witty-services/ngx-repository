import {Type} from '@angular/core';
import {InternalEvent} from '@witty-services/ngx-repository';

export class AfterHttpCreateEvent<T, K> implements InternalEvent {

  public type: Type<any>;

  public object: T;

  public query: any;

  public data: K;

  public constructor(data: Partial<AfterHttpCreateEvent<T, K>>) {
    Object.assign(this, data);
  }
}
