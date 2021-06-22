import {Type} from '@angular/core';
import {InternalEvent} from '@witty-services/ngx-repository';

export class BeforeHttpFindByIdEvent<K> implements InternalEvent {

  public type: Type<any>;

  public id: K;

  public query: any;

  public constructor(data: Partial<BeforeHttpFindByIdEvent<K>>) {
    Object.assign(this, data);
  }
}
