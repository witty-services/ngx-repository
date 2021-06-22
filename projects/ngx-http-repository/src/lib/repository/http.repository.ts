import {HttpRepositoryDriver} from '../driver/http-repository.driver';
import {Observable, of} from 'rxjs';
import {cloneDeep, first} from 'lodash';
import {
  AbstractRepository,
  CreateRepository,
  DeleteRepository,
  FindAllRepository,
  FindByIdRepository,
  FindOneRepository,
  getIdFromObject,
  IdQuery,
  InternalEvent,
  Page,
  PatchRepository,
  PublisherService,
  Repository,
  RequestManager,
  UpdateRepository
} from '@witty-services/ngx-repository';
import {HTTP_RESOURCE_METADATA_KEY} from '../decorator/http-resource.decorator';
import {HttpResponseBuilder} from '../response/http-response.builder';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {HttpRequestBuilder} from '../request/http-request.builder';
import {BeforeHttpFindAllEvent} from './event/before-http-find-all.event';
import {AfterHttpFindAllEvent} from './event/after-http-find-all.event';
import {BeforeHttpFindOneEvent} from './event/before-http-find-one.event';
import {AfterHttpFindOneEvent} from './event/after-http-find-one.event';
import {BeforeHttpFindByIdEvent} from './event/before-http-find-by-id.event';
import {AfterHttpFindByIdEvent} from './event/after-http-find-by-id.event';
import {BeforeHttpCreateEvent} from './event/before-http-create.event';
import {AfterHttpCreateEvent} from './event/after-http-create.event';
import {AfterHttpDeleteEvent} from './event/after-http-delete.event';
import {BeforeHttpDeleteEvent} from './event/before-http-delete.event';
import {BeforeHttpUpdateEvent} from './event/before-http-update.event';
import {AfterHttpUpdateEvent} from './event/after-http-update.event';
import {BeforeHttpPatchEvent} from './event/before-http-patch.event';
import {AfterHttpPatchEvent} from './event/after-http-patch.event';
import {HTTP_LIVE_RESOURCE_METADATA_KEY} from '../decorator/http-live-resource.decorator';
import {log, refreshOn} from '@witty-services/rxjs-common';
import {OnHttpResourceChange} from '../decorator/on-http-resource-change.decorator';

@Repository(null, {
  request: HttpRequestBuilder,
  response: HttpResponseBuilder.withParams()
})
export class HttpRepository<T, K> extends AbstractRepository<T> implements FindAllRepository,
  FindOneRepository,
  FindByIdRepository,
  CreateRepository,
  UpdateRepository,
  DeleteRepository,
  PatchRepository {

  private onWrite$: Observable<InternalEvent>;

  public constructor(requestManager: RequestManager,
                     driver: HttpRepositoryDriver) {
    super(requestManager, driver);

    if (this.isLiveResource()) {
      OnHttpResourceChange({type: () => this.repositoryConfiguration.resourceType(), actions: ['write']})(this, 'onWrite$');
    }
  }

  private isLiveResource(): boolean {
    return Reflect.getMetadata(HTTP_LIVE_RESOURCE_METADATA_KEY, this.repositoryConfiguration.resourceType()) === true;
  }

  public findAll<R = Page<T>>(query?: any): Observable<R> {
    PublisherService.getInstance().publish(new BeforeHttpFindAllEvent(cloneDeep({type: this.repositoryConfiguration.resourceType(), query})));

    let findAll$: Observable<R> = this.execute(null, query, ['findAll', 'read']).pipe(
      tap((data: R) => PublisherService.getInstance().publish(new AfterHttpFindAllEvent(cloneDeep({type: this.repositoryConfiguration.resourceType(), query, data}))))
    );

    if (this.isLiveResource()) {
      findAll$ = findAll$.pipe(refreshOn(this.onWrite$));
    }

    return findAll$;
  }

  public findOne<R = T>(query?: any): Observable<R> {
    PublisherService.getInstance().publish(new BeforeHttpFindOneEvent(cloneDeep({type: this.repositoryConfiguration.resourceType(), query})));

    let findOne$: Observable<R> = this.execute(null, query, ['findOne', 'read']).pipe(
      map((result: any) => first(result) || null),
      tap((data: R) => PublisherService.getInstance().publish(new AfterHttpFindOneEvent(cloneDeep({type: this.repositoryConfiguration.resourceType(), query, data}))))
    );

    if (this.isLiveResource()) {
      findOne$ = findOne$.pipe(
        switchMap((data: R) => of(data).pipe(
          refreshOn(
            this.onWrite$.pipe(
              filter(AfterHttpUpdateEvent.isInstanceOf),
              filter((event: AfterHttpUpdateEvent<any, any>) => getIdFromObject(event.object) === getIdFromObject(data)),
            ),
            this.onWrite$.pipe(
              filter(AfterHttpPatchEvent.isInstanceOf),
              filter((event: AfterHttpPatchEvent<any, any>) => getIdFromObject(event.object) === getIdFromObject(data)),
            ),
            this.onWrite$.pipe(
              filter(AfterHttpDeleteEvent.isInstanceOf),
              filter((event: AfterHttpDeleteEvent<any, any>) => getIdFromObject(event.object) === getIdFromObject(data)),
            )
          )
        ))
      );
    }

    return findOne$;
  }

  public findById<R = T, ID = K>(id: ID, query?: any): Observable<R> {
    PublisherService.getInstance().publish(new BeforeHttpFindByIdEvent(cloneDeep({type: this.repositoryConfiguration.resourceType(), id, query})));

    let findById$: Observable<R> = this.execute(null, new IdQuery(id, query), ['findById', 'read']).pipe(
      tap((data: R) => PublisherService.getInstance().publish(new AfterHttpFindByIdEvent(cloneDeep({type: this.repositoryConfiguration.resourceType(), id, query, data}))))
    );

    if (this.isLiveResource()) {
      findById$ = findById$.pipe(
        refreshOn(
          this.onWrite$.pipe(
            filter(AfterHttpUpdateEvent.isInstanceOf),
            filter((event: AfterHttpUpdateEvent<any, any>) => getIdFromObject(event.object) === id),
          ),
          this.onWrite$.pipe(
            filter(AfterHttpPatchEvent.isInstanceOf),
            filter((event: AfterHttpPatchEvent<any, any>) => getIdFromObject(event.object) === id),
          ),
          this.onWrite$.pipe(
            filter(AfterHttpDeleteEvent.isInstanceOf),
            filter((event: AfterHttpDeleteEvent<any, any>) => getIdFromObject(event.object) === id),
          )
        )
      );
    }

    return findById$;
  }

  public create<O = T, R = K>(object: O, query?: any): Observable<R> {
    PublisherService.getInstance().publish(new BeforeHttpCreateEvent(cloneDeep({type: this.repositoryConfiguration.resourceType(), object, query})));

    return this.execute(object, query, ['create', 'write']).pipe(
      tap((data: R) => PublisherService.getInstance().publish(new AfterHttpCreateEvent(cloneDeep({type: this.repositoryConfiguration.resourceType(), object, query, data}))))
    );
  }

  public delete<O = T, R = void>(object: O, query?: any): Observable<R> {
    PublisherService.getInstance().publish(new BeforeHttpDeleteEvent(cloneDeep({type: this.repositoryConfiguration.resourceType(), object, query})));

    return this.execute(object, query, ['delete', 'write']).pipe(
      tap((data: R) => PublisherService.getInstance().publish(new AfterHttpDeleteEvent(cloneDeep({type: this.repositoryConfiguration.resourceType(), object, query, data}))))
    );
  }

  public update<O = T, R = void>(object: O, query?: any): Observable<R> {
    PublisherService.getInstance().publish(new BeforeHttpUpdateEvent(cloneDeep({type: this.repositoryConfiguration.resourceType(), object, query})));

    return this.execute(object, query, ['update', 'write']).pipe(
      tap((data: R) => PublisherService.getInstance().publish(new AfterHttpUpdateEvent(cloneDeep({type: this.repositoryConfiguration.resourceType(), object, query, data}))))
    );
  }

  public patch<O = T, R = void>(object: O, query?: any): Observable<R> {
    PublisherService.getInstance().publish(new BeforeHttpPatchEvent(cloneDeep({type: this.repositoryConfiguration.resourceType(), object, query})));

    return this.execute(object, query, ['patch', 'write']).pipe(
      tap((data: R) => PublisherService.getInstance().publish(new AfterHttpPatchEvent(cloneDeep({type: this.repositoryConfiguration.resourceType(), object, query, data}))))
    );
  }

  protected getResourceContextKey(): string {
    return HTTP_RESOURCE_METADATA_KEY;
  }

}
