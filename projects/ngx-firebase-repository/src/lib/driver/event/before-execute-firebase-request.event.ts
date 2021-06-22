import {FirebaseRepositoryRequest} from '../../request/firebase-repository.request';
import {InternalEvent} from '@witty-services/ngx-repository';

export class BeforeExecuteFirebaseRequestEvent implements InternalEvent {

  public request: FirebaseRepositoryRequest;

  public constructor(data: Partial<BeforeExecuteFirebaseRequestEvent> = {}) {
    Object.assign(this, data);
  }
}
