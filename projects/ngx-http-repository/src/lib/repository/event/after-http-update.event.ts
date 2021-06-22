import {Type} from '@angular/core';
import {getIdFromObject, InternalEvent} from '@witty-services/ngx-repository';

export class AfterHttpUpdateEvent<T, K> implements InternalEvent {

  public type: Type<any>;

  public object: T;

  public query: any;

  public data: K;

  public constructor(data: Partial<AfterHttpUpdateEvent<T, K>>) {
    Object.assign(this, data);
  }

  public static isInstanceOf(event: InternalEvent): boolean {
    return event instanceof AfterHttpUpdateEvent;
  }
}
