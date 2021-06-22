import {InternalEvent} from '@witty-services/ngx-repository';

export class BeforeFirebaseFindByIdEvent<K> implements InternalEvent {

  public id: K;

  public query: any;

  public constructor(data: Partial<BeforeFirebaseFindByIdEvent<K>>) {
    Object.assign(this, data);
  }
}
