import {Injectable, Injector, Predicate, Type} from '@angular/core';
import {Listener} from './listener';
import {some, chain} from 'lodash';
import {Subject, Observable} from 'rxjs';

interface RegistryItem {

  predicate: Predicate<any>|Predicate<any>[];

  listener: Type<Listener<any>>;
}

@Injectable()
export class PublisherService {

  private static publisher$: Subject<any> = new Subject<any>();

  private static registryItems: RegistryItem[] = [];

  public static getInstance: () => PublisherService;

  public constructor(private readonly injector: Injector) {
  }

  public static addListenerToRegistry(predicate: Predicate<any>|Predicate<any>[], listener: Type<Listener<any>>): void {
    PublisherService.registryItems.push({predicate, listener});
  }

  public static getPublisher(): Observable<any> {
    return PublisherService.publisher$.asObservable();
  }

  public publish<E>(event: E): void {
    chain(PublisherService.registryItems)
      .filter((item: RegistryItem) => Array.isArray(item.predicate) ? some(item.predicate, (p: Predicate<E>) => p(event)) : item.predicate(event))
      .map((item: RegistryItem) => this.injector.get(item.listener as Type<any>, null))
      .filter((service: Listener<any>) => !!service)
      .each((service: Listener<any>) => service.on(event))
      .value();

    PublisherService.publisher$.next(event);
  }
}
