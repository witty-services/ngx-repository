import {Type} from '@angular/core';
import {InternalEvent} from '@witty-services/ngx-repository';

export class AfterHttpFindByIdEvent<T, K> implements InternalEvent {

  public type: Type<any>;

  public id: K;

  public query: any;

  public data: T;

  public constructor(data: Partial<AfterHttpFindByIdEvent<T, K>>) {
    Object.assign(this, data);
  }
}
