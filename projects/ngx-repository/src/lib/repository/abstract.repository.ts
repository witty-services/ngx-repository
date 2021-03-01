import {Driver} from '../driver/driver';
import {get} from 'lodash';
import {ID_METADATA_KEY, IdContext} from '../decorator/id.decorator';
import {QuerySettings} from '../query-builder/query-settings';
import {QueryBuilder} from '../query-builder/query-builder';
import {Query} from '../query-builder/query';
import {REPOSITORY_METADATA_KEY, RepositoryContextConfiguration, RESOURCE_CONFIGURATION_METADATA_KEY} from '../decorator/repository.decorator';
import {PageBuilder} from '../page-builder/page-builder';
import {Page} from '../page-builder/page';
import {ResponseBuilder} from '../item-builder/response-builder';
import {Observable} from 'rxjs';
import {map, mapTo} from 'rxjs/operators';
import {isNullOrUndefined} from 'util';
import {Request} from '../query-builder/request';
import {Normalizer} from '@witty-services/ts-serializer';
import {RepositoryDenormalizer} from '../normalizer/repository-denormalizer';
import {ColumnContextConfiguration, COLUMNS_METADATA_KEY} from '../decorator/column.decorator';
import {Repository} from './repository';

/**
 * @ignore
 */
export abstract class AbstractRepository<T, K, RC, RS> implements Repository<T, K> {

  public constructor(protected resourceContextKey: string,
                     protected driver: Driver<RS>,
                     protected normalizer: Normalizer,
                     protected denormalizer: RepositoryDenormalizer,
                     protected queryBuilder: QueryBuilder<RC>,
                     protected pageBuilder: PageBuilder<RS>,
                     protected createResponseBuilder: ResponseBuilder<RS>,
                     protected findOneResponseBuilder: ResponseBuilder<RS>) {
  }

  protected get repositoryContextConfiguration(): RepositoryContextConfiguration {
    if (Reflect.hasMetadata(REPOSITORY_METADATA_KEY, Object.getPrototypeOf(this).constructor)) {
      return Reflect.getMetadata(REPOSITORY_METADATA_KEY, Object.getPrototypeOf(this).constructor);
    } else if (Reflect.getMetadata(REPOSITORY_METADATA_KEY, this)) {
      return Reflect.getMetadata(REPOSITORY_METADATA_KEY, this);
    } else {
      return null;
    }
  }

  protected get resourceContextConfiguration(): RC {
    if (Reflect.hasMetadata(RESOURCE_CONFIGURATION_METADATA_KEY, Object.getPrototypeOf(this).constructor)) {
      return Reflect.getMetadata(RESOURCE_CONFIGURATION_METADATA_KEY, Object.getPrototypeOf(this).constructor);
    } else if (Reflect.hasMetadata(RESOURCE_CONFIGURATION_METADATA_KEY, this)) {
      return Reflect.getMetadata(RESOURCE_CONFIGURATION_METADATA_KEY, this);
    } else {
      const repositoryContextConfiguration: RepositoryContextConfiguration = this.repositoryContextConfiguration;
      if (!repositoryContextConfiguration) {
        throw new Error('There is no Resource type configuration for this repository.');
      }

      const resourceContextConfiguration: RC = Reflect.getMetadata(this.resourceContextKey, repositoryContextConfiguration.resourceType());
      Reflect.defineMetadata(RESOURCE_CONFIGURATION_METADATA_KEY, resourceContextConfiguration, Object.getPrototypeOf(this).constructor);

      return resourceContextConfiguration;
    }
  }

  public findAll(query?: any): Observable<Page<T>> {
    const request: Request = this.queryBuilder.buildRequestFromQuery(this.buildQuery(query));

    return this.pageBuilder.buildPage(this.driver.findBy(request), this).pipe(
      map((data: Page<T>) => this.denormalizeAll(data, query, request))
    );
  }

  public findById(id: K, query: any = {}): Observable<T> {
    query.id = id;
    const request: Request = this.queryBuilder.buildRequestFromQuery(this.buildQuery(query));

    return this.findOneResponseBuilder.build(
      this.driver.findOne(request),
      this
    ).pipe(
      map((data: any) => this.denormalizeOne(data, query, request))
    );
  }

  public findOne(query: any = {}): Observable<T> {
    const request: Request = this.queryBuilder.buildRequestFromQuery(this.buildQuery(query));

    return this.pageBuilder.buildPage(this.driver.findBy(request), this).pipe(
      map((data: Page<T>) => data[0]),
      map((data: any) => this.denormalizeOne(data, query, request))
    );
  }

  public create(object: T, query?: any): Observable<K> {
    return this.createResponseBuilder.build(
      this.driver.create(
        this.normalizeOne(object),
        this.queryBuilder.buildRequestFromQuery(this.buildQuery(query), object)
      ),
      this
    );
  }

  public update(object: T, query: any = {}): Observable<void> {
    query.id = this.getResourceId(object);
    if (isNullOrUndefined(query.id)) {
      throw new Error('There is no id column configured. See @Id() decorator.');
    }

    return this.driver.update(
      this.normalizeOne(object),
      this.queryBuilder.buildRequestFromQuery(this.buildQuery(query), object)
    ).pipe(
      mapTo(void 0)
    );
  }

  public delete(object: T, query: any = {}): Observable<void> {
    query.id = this.getResourceId(object);
    if (isNullOrUndefined(query.id)) {
      throw new Error('There is no id column configured. See @Id() decorator.');
    }

    return this.driver.delete(this.queryBuilder.buildRequestFromQuery(this.buildQuery(query), object)).pipe(
      mapTo(void 0)
    );
  }

  public getResourceId(object: T): K {
    return get(object, Reflect.getMetadata(ID_METADATA_KEY, object));
  }

  public getIdContext(): IdContext {
    const repositoryContextConfiguration: RepositoryContextConfiguration = this.repositoryContextConfiguration;
    if (!repositoryContextConfiguration) {
      throw new Error('There is no Resource type configuration for this repository.');
    }

    const resourceType: new(...args: any[]) => T = repositoryContextConfiguration.resourceType();
    const propertyKey: string = Reflect.getMetadata(ID_METADATA_KEY, resourceType.prototype);
    if (!propertyKey) {
      throw new Error(`There is no id column configured for ${resourceType.name}. See @Id() decorator.`);
    }

    const columnContextConfigurations: ColumnContextConfiguration<T, K>[] = Reflect.getMetadata(COLUMNS_METADATA_KEY, resourceType.prototype) || [];

    return columnContextConfigurations.find(
      (columnContextConfiguration: ColumnContextConfiguration<T, K>) => columnContextConfiguration.propertyKey === propertyKey
    );
  }

  protected denormalizeAll(datas: Page<any>, query: Query<K>, request: Request): Page<T> {
    if (!datas) {
      return new Page();
    }

    if (!Array.isArray(datas)) {
      throw new Error('Data is not an array, please pass only array in denormalizeAll method.');
    }

    return datas.map((d: any) => this.denormalizeOne(d, query, request));
  }

  protected denormalizeOne(data: any, query: Query<K>, request: Request): T {
    const repositoryContextConfiguration: RepositoryContextConfiguration = this.repositoryContextConfiguration;
    if (!repositoryContextConfiguration) {
      throw new Error('There is no Resource type configuration for this repository.');
    }

    return this.denormalizer.denormalizeWithQuery(repositoryContextConfiguration.resourceType(), data, query, request);
  }

  protected normalizeOne(data: T): any {
    return this.normalizer.normalize(data);
  }

  protected buildQuery(querySettings: Query<K>): QuerySettings<RC, K> {
    return {
      resourceConfiguration: this.resourceContextConfiguration,
      settings: querySettings
    };
  }
}
