import {HttpRepositoryRequest} from '../../request/http-repository.request';
import {HttpRepositoryResponse} from '../../response/http-repository.response';
import {InternalEvent} from '@witty-services/ngx-repository';

export class AfterExecuteHttpRequestEvent implements InternalEvent {

  public request: HttpRepositoryRequest;

  public response: HttpRepositoryResponse;

  public constructor(data: Partial<AfterExecuteHttpRequestEvent> = {}) {
    Object.assign(this, data);
  }
}
