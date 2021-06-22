import {Predicate} from '@angular/core';
import {PublisherService} from '../publisher.service';
import {asyncScheduler, Observable} from 'rxjs';
import {filter, observeOn} from 'rxjs/operators';
import {chain} from 'lodash';
import {softCache} from '@witty-services/rxjs-common';

const EVENT_LISTENER_OBS_METADATA_KEY: string = 'ngx-repository:event-listener-observable';

export function EventListener<E>(predicate?: Predicate<E>|(Predicate<E>[])): any {
  return (target: any, propertyKey?: string) => {
    let finalPredicate: Predicate<E>|Predicate<E>[] = predicate;

    if (!finalPredicate) {
      finalPredicate = () => true;
    }

    if (!propertyKey) {
      PublisherService.addListenerToRegistry(finalPredicate, target);

      return;
    }

    Object.defineProperty(target.constructor.prototype, propertyKey, {
      get(): any {
        if (Reflect.hasOwnMetadata(`${EVENT_LISTENER_OBS_METADATA_KEY}:${propertyKey}`, this)) {
          return Reflect.getOwnMetadata(`${EVENT_LISTENER_OBS_METADATA_KEY}:${propertyKey}`, this);
        }

        let source$: Observable<any>;
        if (Array.isArray(finalPredicate)) {
          source$ = PublisherService.getPublisher().pipe(
            filter((event: any) => chain(finalPredicate).some((p: Predicate<E>) => p(event)).value())
          );
        } else {
          source$ = PublisherService.getPublisher().pipe(
            filter((event: any) => (finalPredicate as Predicate<E>)(event))
          );
        }

        source$ = source$.pipe(
          observeOn(asyncScheduler),
          softCache()
        );
        Reflect.defineMetadata(`${EVENT_LISTENER_OBS_METADATA_KEY}:${propertyKey}`, source$, this);

        return source$;
      },
      set: () => void 0,
      enumerable: true,
      configurable: true
    });

  };
}
