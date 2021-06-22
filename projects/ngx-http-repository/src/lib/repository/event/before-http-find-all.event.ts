import {Type} from '@angular/core';
import {InternalEvent} from '@witty-services/ngx-repository';

export class BeforeHttpFindAllEvent implements InternalEvent {

  public type: Type<any>;

  public query: any;

  public constructor(data: Partial<BeforeHttpFindAllEvent>) {
    Object.assign(this, data);
  }
}
