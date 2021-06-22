import {FirebaseRepositoryRequest} from '../../request/firebase-repository.request';
import {FirebaseRepositoryResponse} from '../../response/firebase-repository.response';
import {InternalEvent} from '@witty-services/ngx-repository';

export class AfterExecuteFirebaseRequestEvent implements InternalEvent {

  public request: FirebaseRepositoryRequest;

  public response: FirebaseRepositoryResponse;

  public constructor(data: Partial<AfterExecuteFirebaseRequestEvent> = {}) {
    Object.assign(this, data);
  }
}
