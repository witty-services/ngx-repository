import {Type} from '@angular/core';
import {InternalEvent} from '@witty-services/ngx-repository';

export class BeforeHttpUpdateEvent<T> implements InternalEvent {

  public type: Type<any>;

  public object: T;

  public query: any;

  public constructor(data: Partial<BeforeHttpUpdateEvent<T>>) {
    Object.assign(this, data);
  }
}
