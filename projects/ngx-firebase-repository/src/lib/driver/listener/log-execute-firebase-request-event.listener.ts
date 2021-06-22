import {EventListener, Listener} from '@witty-services/ngx-repository';
import {Injectable} from '@angular/core';
import {BeforeExecuteFirebaseRequestEvent} from '../event/before-execute-firebase-request.event';
import {AfterExecuteFirebaseRequestEvent} from '../event/after-execute-firebase-request.event';
import {FirebaseRepositoryRequest} from '../../request/firebase-repository.request';

type ExecuteFirebaseRequestEvent = BeforeExecuteFirebaseRequestEvent|AfterExecuteFirebaseRequestEvent;

@Injectable()
@EventListener([(e: ExecuteFirebaseRequestEvent) => e instanceof BeforeExecuteFirebaseRequestEvent, (e: ExecuteFirebaseRequestEvent) => e instanceof AfterExecuteFirebaseRequestEvent])
export class LogExecuteFirebaseRequestEventListener implements Listener<ExecuteFirebaseRequestEvent> {

  public on(event: ExecuteFirebaseRequestEvent): void {
    if (event instanceof BeforeExecuteFirebaseRequestEvent) {
      console.log(this.makeLog(event.request, 'FIREBASE REQUEST'), 'color:red', 'color:black');
    } else if (event instanceof AfterExecuteFirebaseRequestEvent) {
      console.log(this.makeLog(event.request, 'FIREBASE RESPONSE'), 'color:green', 'color:black');
    }
  }

  private makeLog(request: FirebaseRepositoryRequest, type: 'FIREBASE REQUEST'|'FIREBASE RESPONSE'): string {
    return `%c[${type}]%c [${request.operation}] ${request.path.value}`;
  }
}
