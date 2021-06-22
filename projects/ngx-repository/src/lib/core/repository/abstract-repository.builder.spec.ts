import {REPOSITORY_METADATA_KEY, RESOURCE_CONFIGURATION_METADATA_KEY} from '../decorator/repository.decorator';
import {Type} from '@angular/core';
import {AbstractRepository} from './abstract-repository';
import {AbstractRepositoryBuilder} from './abstract-repository.builder';
import {Observable} from 'rxjs';
import {RequestManager} from '../manager/request.manager';
import {RepositoryDriver} from '../driver/repository.driver';
import {PublisherService} from '../event-stream/publisher.service';

class MyClass {
}

class RepositoryBuilder extends AbstractRepositoryBuilder {

  public constructor(resourceContextKey: string) {
    super(resourceContextKey);
  }

  public getRepositoryInstance<T>(resourceType: Type<T>): MyRepository<T> {
    const repositoryClass: Type<MyRepository<T>> = this.createRepositoryClass<T>(MyRepository, resourceType);

    return new repositoryClass();
  }

  public supports<T>(resourceType: Type<T>, repositoryType: Type<AbstractRepository<T>>): boolean {
    return false;
  }
}

class MyRepository<T> extends AbstractRepository<T> {

  public constructor(requestManager: RequestManager = null, driver: RepositoryDriver = null, publisherService: PublisherService = null) {
    super(requestManager, driver, publisherService);
  }

  protected getResourceContextKey(): string {
    return '';
  }

  public execute(body: any, query: any, configurationPaths: string[]): Observable<any> {
    return super.execute(body, query, configurationPaths);
  }

}

describe('AbstractRepositoryBuilder', () => {

  it('should throw an error when no metadata exist on resource class', () => {
    class MyClassWithoutMetadata {}

    const repositoryBuilder: RepositoryBuilder = new RepositoryBuilder('meta');
    expect(() => repositoryBuilder.getRepository(MyClassWithoutMetadata)).toThrowError('MyClassWithoutMetadata is not a valid resource.');
  });

  it('should return a repository instance', () => {
    const meta: any = {};
    const repositoryBuilder: RepositoryBuilder = new RepositoryBuilder('meta');

    Reflect.defineMetadata('meta', meta, MyClass);

    const repositoryInstance: any = repositoryBuilder.getRepository(MyClass);
    expect(repositoryInstance instanceof MyRepository).toBe(true);
    expect(Reflect.getMetadata(RESOURCE_CONFIGURATION_METADATA_KEY, repositoryInstance)).toBe(meta);
    expect(Reflect.getMetadata(REPOSITORY_METADATA_KEY, repositoryInstance).resourceType instanceof Function).toBe(true);
    expect(Reflect.getMetadata(REPOSITORY_METADATA_KEY, repositoryInstance).resourceType()).toEqual(MyClass);
    expect(Reflect.getMetadata(REPOSITORY_METADATA_KEY, repositoryInstance.constructor).resourceType()).toEqual(MyClass);
    expect(Reflect.getMetadata(REPOSITORY_METADATA_KEY, repositoryInstance.constructor).defaultConfiguration.responseType()).toEqual(MyClass);
  });

  it('should throw an error when no metadata exist on repository class', () => {
    Reflect.defineMetadata('meta', {}, MyClass);

    class FakeRepositoryBuilder extends AbstractRepositoryBuilder {

      public constructor(resourceContextKey: string) {
        super(resourceContextKey);
      }

      public getRepositoryInstance<T>(resourceType: Type<T>): AbstractRepository<T> {
        return new MyRepository();
      }

      public supports<T>(resourceType: Type<T>, repositoryType: Type<AbstractRepository<T>>): boolean {
        return false;
      }
    }

    const repositoryBuilder: FakeRepositoryBuilder = new FakeRepositoryBuilder('meta');
    expect(() => repositoryBuilder.getRepository(MyClass)).toThrowError('There is no Resource type configuration for this repository.');
  });
});
