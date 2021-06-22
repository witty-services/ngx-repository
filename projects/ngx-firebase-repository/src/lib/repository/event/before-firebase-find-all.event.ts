import {InternalEvent} from '@witty-services/ngx-repository';

export class BeforeFirebaseFindAllEvent implements InternalEvent {

  public query: any;

  public constructor(data: Partial<BeforeFirebaseFindAllEvent>) {
    Object.assign(this, data);
  }
}
