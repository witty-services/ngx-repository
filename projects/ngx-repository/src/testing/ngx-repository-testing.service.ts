import { Injectable, Type } from '@angular/core';
import { TestRepositoryBuilder } from './test-repository.builder';
import { AbstractRepository } from '../lib/core/repository/abstract-repository';
import { RepositoryService } from '../lib/repository-service';

/**
 * @ignore
 */
@Injectable()
export class NgxRepositoryTestingService implements RepositoryService {

  public constructor(private readonly repositoryBuilder: TestRepositoryBuilder) {
  }

  public getRepository<T>(resourceType: Type<T>, repositoryType: Type<AbstractRepository<T>>): AbstractRepository<T> {
    return this.repositoryBuilder.getRepository(resourceType, repositoryType);
  }
}
