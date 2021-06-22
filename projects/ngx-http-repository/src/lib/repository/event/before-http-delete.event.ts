import {Type} from '@angular/core';
import {InternalEvent} from '@witty-services/ngx-repository';

export class BeforeHttpDeleteEvent<T> implements InternalEvent {

  public type: Type<any>;

  public object: T;

  public query: any;

  public constructor(data: Partial<BeforeHttpDeleteEvent<T>>) {
    Object.assign(this, data);
  }
}
