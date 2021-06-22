import {Inject, Injectable, InjectionToken, Injector, Type} from '@angular/core';
import {RepositoryBuilder} from './core/repository/repository.builder';
import {REPOSITORY_BUILDER_TOKEN} from './ngx-repository.module.di';
import {TokenRegistry} from './core/registry/token.registry';
import {AbstractRepository} from './core/repository/abstract-repository';
import {RepositoryService} from './repository-service';

/**
 * @ignore
 */
// @dynamic
@Injectable()
export class NgxRepositoryService implements RepositoryService {

  public static getInstance: () => RepositoryService;

  protected injector: Injector;

  public constructor(protected parentInjector: Injector,
                     @Inject(REPOSITORY_BUILDER_TOKEN) private readonly repositoryBuilders: RepositoryBuilder[]) {
    this.injector = Injector.create({
      providers: [],
      parent: this.parentInjector
    });
  }

  public getRepository<T>(resourceType: Type<T>, repositoryType: Type<AbstractRepository<T>>): AbstractRepository<T> {
    let finalRepository: AbstractRepository<T> = this.searchForExistingService(repositoryType);
    if (finalRepository) {
      return finalRepository;
    }

    finalRepository = this.searchForExistingToken(resourceType, repositoryType);
    if (finalRepository) {
      return finalRepository;
    }

    return this.createNewRepository(resourceType, repositoryType);
  }

  private searchForExistingService<T>(repositoryType?: Type<AbstractRepository<T>>): AbstractRepository<T> {
    if (!repositoryType) {
      return null;
    }

    return this.injector.get(repositoryType, null);
  }

  private searchForExistingToken<T>(resourceType: Type<T>, repositoryType?: Type<AbstractRepository<T>>): AbstractRepository<T> {
    const token: InjectionToken<any> = TokenRegistry.findToken(resourceType, repositoryType);

    if (!token) {
      return null;
    }

    const repositories: AbstractRepository<T> | AbstractRepository<T>[] = this.injector.get(token);

    if (repositories && Array.isArray(repositories)) {
      if (!repositoryType) {
        throw new Error(
          `With multiple connection types, you must have to provide the repository argument in JoinColumn, SubCollection and InjectRepository decorator of your ${ resourceType.name } resource.`
        );
      }

      return repositories.find((rep: AbstractRepository<T>) => rep instanceof repositoryType);
    } else {
      return repositories as AbstractRepository<T>;
    }
  }

  private createNewRepository<T>(resourceType: Type<T>, repositoryType?: Type<AbstractRepository<T>>): AbstractRepository<T> {
    if (this.repositoryBuilders.length === 0) {
      throw new Error('There is not connection configured.');
    }

    let repository: AbstractRepository<T>;
    if (this.repositoryBuilders.length === 1) {
      repository = this.repositoryBuilders[0].getRepository(resourceType, repositoryType);
    } else if (this.repositoryBuilders.length > 1) {
      if (!repositoryType) {
        throw new Error(
          `With multiple connection types, you must have to provide the repository argument in JoinColumn, SubCollection and InjectRepository decorator of your ${ resourceType.name } resource.`
        );
      }
      const connection: RepositoryBuilder = this.repositoryBuilders.find((c: RepositoryBuilder) => c.supports(resourceType, repositoryType));
      if (!connection) {
        throw new Error(`There is no RepositoryBuilder to support the repository type ${ repositoryType.name }`);
      }

      repository = connection.getRepository(resourceType, repositoryType);
    }

    const token: InjectionToken<AbstractRepository<T>> = TokenRegistry.addTokenToRegistry(resourceType, repositoryType);

    this.injector = Injector.create({
      providers: [{
        provide: token,
        useValue: repository
      }],
      parent: this.injector
    });

    return repository;
  }
}
