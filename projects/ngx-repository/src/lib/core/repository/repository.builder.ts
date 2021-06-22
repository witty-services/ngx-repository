import { Type } from '@angular/core';
import { AbstractRepository } from './abstract-repository';

/**
 * @ignore
 */
export interface RepositoryBuilder {

  supports<T>(resourceType: Type<T>, repositoryType: Type<AbstractRepository<T>>): boolean;

  getRepository<T>(resourceType: Type<T>, repositoryType?: Type<AbstractRepository<T>>): AbstractRepository<T>;

}
