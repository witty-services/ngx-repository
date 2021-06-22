import {InternalEvent} from '@witty-services/ngx-repository';

export class BeforeFirebaseUpdateEvent<T> implements InternalEvent {

  public object: T;

  public query: any;

  public constructor(data: Partial<BeforeFirebaseUpdateEvent<T>>) {
    Object.assign(this, data);
  }
}
