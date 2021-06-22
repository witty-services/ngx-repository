import { InjectionToken } from '@angular/core';
import { RepositoryBuilder } from './core/repository/repository.builder';

/**
 * @ignore
 */
export const REPOSITORY_BUILDER_TOKEN: InjectionToken<RepositoryBuilder> = new InjectionToken<RepositoryBuilder>('REPOSITORY_BUILDER');
