import {InternalEvent} from '@witty-services/ngx-repository';

export class BeforeFirebaseCreateEvent<T> implements InternalEvent {

  public object: T;

  public query: any;

  public constructor(data: Partial<BeforeFirebaseCreateEvent<T>>) {
    Object.assign(this, data);
  }
}
