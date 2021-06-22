import {
  Repository,
  REPOSITORY_METADATA_KEY,
  RESOURCE_CONFIGURATION_METADATA_KEY
} from '../decorator/repository.decorator';
import { Type } from '@angular/core';
import { AbstractRepository } from './abstract-repository';
import { ConfigurationProvider } from '../configuration/configuration.provider';
import { ResourceConfiguration } from '../configuration/resource.configuration';
import { RepositoryContextConfiguration } from '../configuration/context/repository-context.configuration';
import { RepositoryBuilder } from './repository.builder';

/**
 * @ignore
 */
export abstract class AbstractRepositoryBuilder implements RepositoryBuilder {

  protected constructor(protected resourceContextKey: string) {
  }

  public abstract supports<T>(resourceType: Type<T>, repositoryType: Type<AbstractRepository<T>>): boolean;

  public getRepository<T>(resourceType: Type<T>, repositoryType?: Type<AbstractRepository<T>>): AbstractRepository<T> {
    if (!Reflect.hasMetadata(this.resourceContextKey, resourceType)) {
      throw new Error(`${ resourceType.name } is not a valid resource.`);
    }

    const repository: AbstractRepository<T> = this.getRepositoryInstance<T>(resourceType);

    const resourceContextConfiguration: ConfigurationProvider = Reflect.getMetadata(this.resourceContextKey, resourceType);
    Reflect.defineMetadata(RESOURCE_CONFIGURATION_METADATA_KEY, resourceContextConfiguration, repository);

    // TODO @TNI/@RMA : Do we need defaultConfiguration with responseType like in createRepositoryClass
    const resourceTypeContextConfiguration: RepositoryContextConfiguration<T> = {
      resourceType: () => resourceType
    };
    Reflect.defineMetadata(REPOSITORY_METADATA_KEY, resourceTypeContextConfiguration, repository);

    return repository;
  }

  protected abstract getRepositoryInstance<T>(resourceType: Type<T>, repositoryType?: Type<AbstractRepository<T>>): AbstractRepository<T>;

  protected createRepositoryClass<T>(repositoryType: Type<any>, resourceType: Type<T>): Type<any> {
    const defaultConfiguration: ResourceConfiguration = {
      responseType: () => resourceType
    };

    @Repository(() => resourceType, defaultConfiguration)
    class RepositoryImpl extends repositoryType {

    }

    return RepositoryImpl;
  }
}
