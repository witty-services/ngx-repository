import {Type} from '@angular/core';
import {AbstractRepository} from './core/repository/abstract-repository';

export interface RepositoryService {
  getRepository<T>(resourceType: Type<T>, repositoryType: Type<AbstractRepository<T>>): AbstractRepository<T>;
}
