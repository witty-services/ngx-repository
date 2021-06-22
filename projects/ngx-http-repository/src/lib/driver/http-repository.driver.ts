import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {HttpRepositoryRequest} from '../request/http-repository.request';
import {Observable} from 'rxjs';
import {PublisherService, RepositoryDriver} from '@witty-services/ngx-repository';
import {map, tap} from 'rxjs/operators';
import {HttpRepositoryResponse} from '../response/http-repository.response';
import {BeforeExecuteHttpRequestEvent} from './event/before-execute-http-request.event';
import {AfterExecuteHttpRequestEvent} from './event/after-execute-http-request.event';
import {cloneDeep} from 'lodash';

@Injectable()
export class HttpRepositoryDriver implements RepositoryDriver {

  public constructor(protected readonly http: HttpClient) {
  }

  public execute(request: HttpRepositoryRequest): Observable<HttpRepositoryResponse> {
    PublisherService.getInstance().publish(new BeforeExecuteHttpRequestEvent(cloneDeep({request})));

    return this.http.request(request.method, request.path.value, {
      params: request.queryParams,
      headers: request.headers,
      observe: 'response',
      body: request.body,
      responseType: 'json'
    }).pipe(
      map((response: HttpResponse<any>) => new HttpRepositoryResponse(response, request)),
      tap((response: HttpRepositoryResponse) => PublisherService.getInstance().publish(new AfterExecuteHttpRequestEvent(cloneDeep({request, response}))))
    );
  }
}
