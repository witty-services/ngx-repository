import {InternalEvent} from '@witty-services/ngx-repository';

export class BeforeFirebaseFindOneEvent implements InternalEvent {

  public query: any;

  public constructor(data: Partial<BeforeFirebaseFindOneEvent>) {
    Object.assign(this, data);
  }
}
