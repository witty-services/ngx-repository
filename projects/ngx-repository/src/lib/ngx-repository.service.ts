import {Inject, Injectable, InjectionToken, Injector, Type} from '@angular/core';
import {AbstractRepository} from './repository/abstract.repository';
import {Connection} from './connection/connection';
import {CONNECTIONS_TOKEN} from './ngx-repository.module.di';
import {TokenRegistry} from './registry/token.registry';
import {MockRepository} from '../test/mock.repository';
import {Repository} from './repository/repository';

/**
 * @ignore
 */
@Injectable()
export class NgxRepositoryService {

  protected injector: Injector;

  public constructor(protected parentInjector: Injector,
                     @Inject(CONNECTIONS_TOKEN) protected readonly connections: Connection<any, any>[]) {
    this.injector = Injector.create({
      providers: [],
      parent: this.parentInjector
    });
  }

  public getRepository<T, K, RC, RS>(resourceType: new(...args: any) => T, repositoryType?: Type<AbstractRepository<T, K, RC, RS>>): AbstractRepository<T, K, RC, RS> {
    let finalRepository: AbstractRepository<T, K, RC, RS> = this.searchForExistingService(repositoryType);
    if (finalRepository) {
      return finalRepository;
    }

    finalRepository = this.searchForExistingToken(resourceType, repositoryType);
    if (finalRepository) {
      return finalRepository;
    }

    return this.createNewRepository(resourceType, repositoryType);
  }

  private searchForExistingService<T, K, RC, RS>(repositoryType?: Type<AbstractRepository<T, K, RC, RS>>): AbstractRepository<T, K, RC, RS> {
    if (!repositoryType) {
      return null;
    }

    return this.injector.get(repositoryType, null);
  }

  private searchForExistingToken<T, K, RC, RS>(resourceType: new(...args: any) => T, repositoryType?: Type<AbstractRepository<T, K, RC, RS>>): AbstractRepository<T, K, RC, RS> {
    const token: InjectionToken<any> = TokenRegistry.findToken(resourceType, repositoryType);

    if (!token) {
      return null;
    }

    const repositories: AbstractRepository<T, K, RC, RS> | AbstractRepository<T, K, RC, RS>[] = this.injector.get(token);

    if (repositories && Array.isArray(repositories)) {
      if (!repositoryType) {
        throw new Error(
          `With multiple connection types, you must have to provide the repository argument in JoinColumn, SubCollection and InjectRepository decorator of your ${resourceType.name} resource.`
        );
      }

      return repositories.find((rep: AbstractRepository<any, any, any, any>) => rep instanceof repositoryType);
    } else {
      return repositories as AbstractRepository<T, K, RC, RS>;
    }
  }

  protected createNewRepository<T, K, RC, RS>(resourceType: new(...args: any) => T, repositoryType?: Type<AbstractRepository<T, K, RC, RS>>): AbstractRepository<T, K, RC, RS> {
    if (this.connections.length === 0) {
      throw new Error('There is not connection configured.');
    }

    let repository: AbstractRepository<T, K, RC, RS>;
    if (this.connections.length === 1) {
      repository = this.connections[0].getRepository(resourceType);
    } else if (this.connections.length > 1) {
      if (!repositoryType) {
        throw new Error(
          `With multiple connection types, you must have to provide the repository argument in JoinColumn, SubCollection and InjectRepository decorator of your ${resourceType.name} resource.`
        );
      }
      const connection: Connection<any, any> = this.connections.find((c: Connection<any, any>) => c.supports(repositoryType));
      if (!connection) {
        throw new Error(`There is no connection to support the repository type ${repositoryType.name}`);
      }

      repository = connection.getRepository(resourceType);
    }

    const token: InjectionToken<AbstractRepository<T, K, RC, RS>> = TokenRegistry.addTokenToRegistry(resourceType, repositoryType);

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

@Injectable()
export class NgxRepositoryTestingService extends NgxRepositoryService {
  public constructor(protected parentInjector: Injector,
                     @Inject(CONNECTIONS_TOKEN) connections: Connection<any, any>[]) {
    super(parentInjector, connections);
  }

  protected createNewRepository<T, K, RC, RS>(resourceType: new(...args: any) => T, repositoryType?: Type<Repository<T, K>>): Repository<T, K> {
    const repository: AbstractRepository<T, K, RC, RS> = new MockRepository();

    const token: InjectionToken<AbstractRepository<T, K, RC, RS>> = TokenRegistry.addTokenToRegistry(resourceType, repositoryType);

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
