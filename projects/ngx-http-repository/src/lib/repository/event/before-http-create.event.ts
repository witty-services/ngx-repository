import {Type} from '@angular/core';
import {InternalEvent} from '@witty-services/ngx-repository';

export class BeforeHttpCreateEvent<T> implements InternalEvent {

  public type: Type<any>;

  public object: T;

  public query: any;

  public constructor(data: Partial<BeforeHttpCreateEvent<T>>) {
    Object.assign(this, data);
  }
}
