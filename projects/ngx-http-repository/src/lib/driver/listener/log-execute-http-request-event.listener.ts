import {EventListener, Listener} from '@witty-services/ngx-repository';
import {BeforeExecuteHttpRequestEvent} from '../event/before-execute-http-request.event';
import {AfterExecuteHttpRequestEvent} from '../event/after-execute-http-request.event';
import {Injectable} from '@angular/core';
import {HttpRepositoryRequest} from '../../request/http-repository.request';

type ExecuteHttpRequestEvent = BeforeExecuteHttpRequestEvent|AfterExecuteHttpRequestEvent;

@Injectable()
@EventListener([
  (e: ExecuteHttpRequestEvent) => e instanceof BeforeExecuteHttpRequestEvent,
  (e: ExecuteHttpRequestEvent) => e instanceof AfterExecuteHttpRequestEvent
])
export class LogExecuteHttpRequestEventListener implements Listener<ExecuteHttpRequestEvent> {

  public on(event: ExecuteHttpRequestEvent): void {
    if (event instanceof BeforeExecuteHttpRequestEvent) {
      console.log(this.makeLog(event.request, 'HTTP REQUEST'), 'color:red', 'color:black');
    } else if (event instanceof AfterExecuteHttpRequestEvent) {
      console.log(this.makeLog(event.request, 'HTTP RESPONSE'), 'color:green', 'color:black');
    }
  }

  private makeLog(request: HttpRepositoryRequest, type: 'HTTP REQUEST'|'HTTP RESPONSE'): string {
    let log: string = `%c[${type}]%c [${request.method}] ${request.path.value}`;

    if (request.queryParams.keys().length > 0) {
      log += `?${request.queryParams} `;
    }

    return log + Object.keys(request.headers).map((key: string) => {
      return `${key}:${request.headers[key]}`;
    }).join('|');
  }
}
