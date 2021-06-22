import {InternalEvent} from '@witty-services/ngx-repository';

export class BeforeFirebaseDeleteEvent<T> implements InternalEvent {

  public object: T;

  public query: any;

  public constructor(data: Partial<BeforeFirebaseDeleteEvent<T>>) {
    Object.assign(this, data);
  }
}
