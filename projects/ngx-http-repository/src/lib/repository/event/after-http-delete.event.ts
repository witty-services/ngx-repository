import {Type} from '@angular/core';
import {InternalEvent} from '@witty-services/ngx-repository';

export class AfterHttpDeleteEvent<T, K> implements InternalEvent {

  public type: Type<any>;

  public object: T;

  public query: any;

  public data: K;

  public constructor(data: Partial<AfterHttpDeleteEvent<T, K>>) {
    Object.assign(this, data);
  }

  public static isInstanceOf(event: InternalEvent): boolean {
    return event instanceof AfterHttpDeleteEvent;
  }
}
